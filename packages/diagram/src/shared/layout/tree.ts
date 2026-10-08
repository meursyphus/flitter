import { type LayoutAlgorithm, type LayoutGraph, isHorizontal, normalizePositions } from "./types";
import type { XYPosition } from "../geometry";

/**
 * Tidy tree layout: each subtree gets a contiguous span on the cross axis,
 * parents are centred above their children. Nodes with several incoming
 * edges keep their first parent; extra roots are laid out side by side.
 */
export function computeTree(graph: LayoutGraph): Record<string, XYPosition> {
  const { nodes, options } = graph;
  if (nodes.length === 0) return {};
  const ids = new Set(nodes.map((n) => n.id));
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const children = new Map<string, string[]>();
  const parent = new Map<string, string>();
  for (const id of ids) children.set(id, []);
  for (const e of graph.edges) {
    if (!ids.has(e.source) || !ids.has(e.target) || e.source === e.target) continue;
    if (parent.has(e.target)) continue;
    // avoid cycles: never make an ancestor a child
    let ancestor: string | undefined = e.source;
    let cyclic = false;
    while (ancestor) {
      if (ancestor === e.target) {
        cyclic = true;
        break;
      }
      ancestor = parent.get(ancestor);
    }
    if (cyclic) continue;
    parent.set(e.target, e.source);
    children.get(e.source)!.push(e.target);
  }
  const roots = nodes.filter((n) => !parent.has(n.id)).map((n) => n.id);
  const horizontal = isHorizontal(options.direction);
  const crossSize = (id: string) => (horizontal ? nodeById.get(id)!.height : nodeById.get(id)!.width);
  const mainSize = (id: string) => (horizontal ? nodeById.get(id)!.width : nodeById.get(id)!.height);

  const span = new Map<string, number>();
  const computeSpan = (id: string): number => {
    const kids = children.get(id)!;
    let total = 0;
    kids.forEach((kid, i) => {
      total += computeSpan(kid) + (i > 0 ? options.nodeSpacing : 0);
    });
    const result = Math.max(crossSize(id), total);
    span.set(id, result);
    return result;
  };
  roots.forEach(computeSpan);

  const positions: Record<string, XYPosition> = {};
  const depthMain = new Map<number, number>();
  const place = (id: string, crossStart: number, depth: number) => {
    const kids = children.get(id)!;
    const total = span.get(id)!;
    const cross = crossStart + (total - crossSize(id)) / 2;
    positions[id] = horizontal ? { x: 0, y: cross } : { x: cross, y: 0 };
    depthMain.set(depth, Math.max(depthMain.get(depth) ?? 0, mainSize(id)));
    (positions[id] as XYPosition & { depth?: number }).depth = depth;
    let childStart = crossStart + (total - (kids.reduce((s, k, i) => s + span.get(k)! + (i > 0 ? options.nodeSpacing : 0), 0))) / 2;
    for (const kid of kids) {
      place(kid, childStart, depth + 1);
      childStart += span.get(kid)! + options.nodeSpacing;
    }
  };
  let cursor = 0;
  for (const root of roots) {
    place(root, cursor, 0);
    cursor += span.get(root)! + options.nodeSpacing;
  }
  const depthOffsets: number[] = [];
  let main = 0;
  for (let d = 0; depthMain.has(d); d++) {
    depthOffsets[d] = main;
    main += depthMain.get(d)! + options.rankSpacing;
  }
  for (const id of ids) {
    const p = positions[id] as XYPosition & { depth?: number };
    if (!p) continue;
    const depth = p.depth ?? 0;
    const offset = depthOffsets[depth] + (depthMain.get(depth)! - mainSize(id)) / 2;
    positions[id] = horizontal ? { x: offset, y: p.y } : { x: p.x, y: offset };
  }
  if (options.direction === "BT" || options.direction === "RL") {
    const extent = main - options.rankSpacing;
    for (const id of ids) {
      const p = positions[id];
      positions[id] = horizontal
        ? { x: extent - p.x - nodeById.get(id)!.width, y: p.y }
        : { x: p.x, y: extent - p.y - nodeById.get(id)!.height };
    }
  }
  return normalizePositions(positions, nodes, options.origin);
}

export const treeLayout: LayoutAlgorithm = {
  name: "tree",
  compute: (graph) => ({ positions: computeTree(graph) }),
};
