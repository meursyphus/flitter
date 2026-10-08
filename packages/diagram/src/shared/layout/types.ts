import type { Dimensions, XYPosition } from "../geometry";

export type LayoutDirection = "TB" | "BT" | "LR" | "RL";

export type LayoutNode = {
  id: string;
  width: number;
  height: number;
  /** Current position; algorithms may use it as a seed. */
  position: XYPosition;
  parentId?: string;
  data?: unknown;
};

export type LayoutEdge = { id: string; source: string; target: string };

export type LayoutOptions = {
  /** Main flow direction for hierarchical algorithms. */
  direction?: LayoutDirection;
  /** Gap between sibling nodes on the cross axis. */
  nodeSpacing?: number;
  /** Gap between ranks/levels on the main axis. */
  rankSpacing?: number;
  /** Top-left of the laid-out graph. */
  origin?: XYPosition;
  /** Padding between a parent's border and its laid-out children, on every side. */
  childPadding?: number;
  /**
   * Grow parents so their laid-out children fit inside `childPadding`.
   * Parents never shrink. Defaults to true.
   */
  fitParents?: boolean;
  /** Algorithm-specific settings. */
  [key: string]: unknown;
};

export type LayoutGraph = {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  options: Required<Pick<LayoutOptions, "direction" | "nodeSpacing" | "rankSpacing" | "origin">> & LayoutOptions;
};

export type LayoutResult = {
  /** New top-left positions keyed by node id. Nodes left out keep their position. */
  positions: Record<string, XYPosition>;
};

/**
 * A pluggable layout algorithm. `compute` may be synchronous or return a
 * promise, so ELK/dagre/web-worker based layouts plug in the same way.
 */
export type LayoutAlgorithm = {
  name: string;
  compute: (graph: LayoutGraph) => LayoutResult | Promise<LayoutResult>;
};

export const defaultLayoutOptions = {
  direction: "TB" as LayoutDirection,
  nodeSpacing: 50,
  rankSpacing: 100,
  origin: { x: 0, y: 0 },
  childPadding: 20,
};

export function isHorizontal(direction: LayoutDirection): boolean {
  return direction === "LR" || direction === "RL";
}

/** Shift a set of top-left positions so their bounding box starts at `origin`. */
export function normalizePositions(
  positions: Record<string, XYPosition>,
  nodes: LayoutNode[],
  origin: XYPosition,
): Record<string, XYPosition> {
  let minX = Infinity;
  let minY = Infinity;
  for (const node of nodes) {
    const p = positions[node.id];
    if (!p) continue;
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY)) return positions;
  const result: Record<string, XYPosition> = {};
  for (const [id, p] of Object.entries(positions)) {
    result[id] = { x: p.x - minX + origin.x, y: p.y - minY + origin.y };
  }
  return result;
}

export function sizeOf(node: LayoutNode): Dimensions {
  return { width: node.width || 0, height: node.height || 0 };
}
