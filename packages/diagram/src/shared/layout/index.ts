import type { Dimensions, XYPosition } from "../geometry";
import {
  type LayoutAlgorithm,
  type LayoutEdge,
  type LayoutGraph,
  type LayoutNode,
  type LayoutOptions,
  defaultLayoutOptions,
} from "./types";

export * from "./types";
export { layeredLayout, computeLayered } from "./layered";
export { treeLayout, computeTree } from "./tree";
export {
  gridLayout,
  computeGrid,
  circularLayout,
  computeCircular,
  forceLayout,
  computeForce,
  manualLayout,
} from "./simple";

type NodeInput = {
  id: string;
  position: XYPosition;
  width?: number;
  height?: number;
  measured?: { width: number; height: number };
  parentId?: string;
  hidden?: boolean;
  data?: unknown;
};

function sizeOfInput(n: NodeInput): Dimensions {
  return {
    width: n.width ?? n.measured?.width ?? 0,
    height: n.height ?? n.measured?.height ?? 0,
  };
}

function toLayoutNode(n: NodeInput, size: Dimensions = sizeOfInput(n)): LayoutNode {
  return {
    id: n.id,
    width: size.width,
    height: size.height,
    position: n.position,
    parentId: n.parentId,
    data: n.data,
  };
}

/** Flat graph of every visible node; nested nodes are included as-is. */
export function toLayoutGraph(
  nodes: NodeInput[],
  edges: LayoutEdge[],
  options: LayoutOptions = {},
): LayoutGraph {
  return {
    nodes: nodes.filter((n) => !n.hidden).map((n) => toLayoutNode(n)),
    edges,
    options: { ...defaultLayoutOptions, ...options },
  };
}

export type HierarchicalLayoutResult = {
  /** New top-left positions keyed by node id; nested nodes are relative to their parent. */
  positions: Record<string, XYPosition>;
  /**
   * Parents that grew so their laid-out children fit inside `childPadding`
   * (see `fitParents`). Only parents whose size changed are listed.
   */
  dimensions: Record<string, Dimensions>;
};

/**
 * Split nodes into containers (the root and every parent) and lay each one
 * out separately, so nested nodes get positions relative to their parent. An
 * edge between nodes in different containers is attributed to the ancestors
 * that sit in a shared container. Containers are processed deepest first, so
 * a parent that grew to fit its children takes part in its own container's
 * layout at the new size.
 */
export async function computeHierarchicalLayout(
  nodes: NodeInput[],
  edges: LayoutEdge[],
  algorithm: LayoutAlgorithm,
  options: LayoutOptions = {},
): Promise<HierarchicalLayoutResult> {
  const visible = nodes.filter((n) => !n.hidden);
  const byId = new Map(visible.map((n) => [n.id, n]));
  const containerOf = (id: string): string | null => {
    const node = byId.get(id);
    return node?.parentId && byId.has(node.parentId) ? node.parentId : null;
  };
  // ancestor chain from the node up to the root, including the node itself
  const chain = (id: string): string[] => {
    const result: string[] = [];
    let current: string | null = id;
    let guard = 0;
    while (current && guard++ < 64) {
      result.push(current);
      current = containerOf(current);
    }
    return result;
  };
  const containers = new Map<string | null, NodeInput[]>();
  for (const node of visible) {
    const key = containerOf(node.id);
    if (!containers.has(key)) containers.set(key, []);
    containers.get(key)!.push(node);
  }
  const containerEdges = new Map<string | null, LayoutEdge[]>();
  for (const edge of edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) continue;
    const sourceChain = chain(edge.source);
    const targetChain = chain(edge.target);
    // find the deepest container shared by both chains
    for (const sourceId of sourceChain) {
      const container = containerOf(sourceId);
      const targetId = targetChain.find((id) => containerOf(id) === container);
      if (targetId == null) continue;
      if (sourceId === targetId) break; // one is inside the other: no layout edge
      if (!containerEdges.has(container)) containerEdges.set(container, []);
      containerEdges.get(container)!.push({ id: edge.id, source: sourceId, target: targetId });
      break;
    }
  }
  const childPadding = Number(options.childPadding ?? defaultLayoutOptions.childPadding);
  const fitParents = options.fitParents ?? true;
  const grown = new Map<string, Dimensions>();
  const sizeOf = (n: NodeInput): Dimensions => grown.get(n.id) ?? sizeOfInput(n);
  const depthOf = (container: string | null): number => (container == null ? 0 : chain(container).length);
  const order = [...containers.keys()].sort((a, b) => depthOf(b) - depthOf(a));
  const positions: Record<string, XYPosition> = {};
  const dimensions: Record<string, Dimensions> = {};
  for (const container of order) {
    const members = containers.get(container)!;
    const origin = container == null ? options.origin : { x: childPadding, y: childPadding };
    const graph: LayoutGraph = {
      nodes: members.map((n) => toLayoutNode(n, sizeOf(n))),
      edges: containerEdges.get(container) ?? [],
      options: { ...defaultLayoutOptions, ...options, origin: origin ?? defaultLayoutOptions.origin },
    };
    const result = await algorithm.compute(graph);
    Object.assign(positions, result.positions);
    if (container == null || !fitParents) continue;
    // Grow the parent (never shrink it) so every laid-out child fits inside the padding.
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const member of members) {
      const position = positions[member.id] ?? member.position;
      const size = sizeOf(member);
      maxX = Math.max(maxX, position.x + size.width);
      maxY = Math.max(maxY, position.y + size.height);
    }
    const current = sizeOf(byId.get(container)!);
    const width = Math.max(current.width, maxX + childPadding);
    const height = Math.max(current.height, maxY + childPadding);
    if (width !== current.width || height !== current.height) {
      grown.set(container, { width, height });
      dimensions[container] = { width, height };
    }
  }
  return { positions, dimensions };
}

/**
 * Run `algorithm` over plain nodes/edges and return nodes with updated
 * positions. Works outside the widget tree, for example in tests or on a
 * server. Nested nodes (`parentId`) are laid out inside their parent, and a
 * parent that grew to fit them gets its new `width`/`height`.
 */
export async function layoutNodes<N extends NodeInput>(
  nodes: N[],
  edges: LayoutEdge[],
  algorithm: LayoutAlgorithm,
  options: LayoutOptions = {},
): Promise<N[]> {
  const { positions, dimensions } = await computeHierarchicalLayout(nodes, edges, algorithm, options);
  return nodes.map((node) => {
    const position = positions[node.id];
    const size = dimensions[node.id];
    if (!position && !size) return node;
    return {
      ...node,
      ...(position ? { position } : {}),
      ...(size ? { width: size.width, height: size.height } : {}),
    };
  });
}
