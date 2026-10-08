import {
  type LayoutAlgorithm,
  type LayoutGraph,
  type LayoutNode,
  isHorizontal,
  normalizePositions,
} from "./types";
import type { XYPosition } from "../geometry";

/**
 * Sugiyama-style layered layout (what dagre does, trimmed down): break
 * cycles, rank by longest path, order ranks by barycenter sweeps, then place
 * ranks along the main axis and nodes along the cross axis.
 */
export function computeLayered(graph: LayoutGraph): Record<string, XYPosition> {
  const { nodes, options } = graph;
  const ids = new Set(nodes.map((n) => n.id));
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const edges = graph.edges.filter((e) => ids.has(e.source) && ids.has(e.target) && e.source !== e.target);
  if (nodes.length === 0) return {};

  // --- break cycles with a DFS: back edges are reversed
  const outgoing = new Map<string, string[]>();
  for (const id of ids) outgoing.set(id, []);
  const state = new Map<string, 0 | 1 | 2>();
  const dagEdges: { source: string; target: string }[] = [];
  const adjacency = new Map<string, string[]>();
  for (const id of ids) adjacency.set(id, []);
  for (const e of edges) adjacency.get(e.source)!.push(e.target);
  const visit = (id: string) => {
    state.set(id, 1);
    for (const target of adjacency.get(id)!) {
      const s = state.get(target) ?? 0;
      if (s === 1) dagEdges.push({ source: target, target: id });
      else {
        dagEdges.push({ source: id, target });
        if (s === 0) visit(target);
      }
    }
    state.set(id, 2);
  };
  for (const node of nodes) if ((state.get(node.id) ?? 0) === 0) visit(node.id);
  const uniqueEdges = new Map<string, { source: string; target: string }>();
  for (const e of dagEdges) uniqueEdges.set(`${e.source}->${e.target}`, e);
  const successors = new Map<string, string[]>();
  const predecessors = new Map<string, string[]>();
  for (const id of ids) {
    successors.set(id, []);
    predecessors.set(id, []);
  }
  for (const e of uniqueEdges.values()) {
    successors.get(e.source)!.push(e.target);
    predecessors.get(e.target)!.push(e.source);
  }

  // --- rank by longest path from sources
  const rank = new Map<string, number>();
  const computeRank = (id: string): number => {
    const cached = rank.get(id);
    if (cached != null) return cached;
    rank.set(id, 0);
    let r = 0;
    for (const p of predecessors.get(id)!) r = Math.max(r, computeRank(p) + 1);
    rank.set(id, r);
    return r;
  };
  for (const node of nodes) computeRank(node.id);
  const rankCount = Math.max(...Array.from(rank.values())) + 1;
  const layers: string[][] = Array.from({ length: rankCount }, () => []);
  for (const node of nodes) layers[rank.get(node.id)!].push(node.id);

  // --- order within layers by barycenter sweeps
  const order = new Map<string, number>();
  const assignOrder = () => layers.forEach((layer) => layer.forEach((id, i) => order.set(id, i)));
  assignOrder();
  const barycenter = (id: string, neighbors: string[]) => {
    if (neighbors.length === 0) return order.get(id)!;
    return neighbors.reduce((sum, n) => sum + order.get(n)!, 0) / neighbors.length;
  };
  for (let iteration = 0; iteration < 8; iteration++) {
    const down = iteration % 2 === 0;
    const sequence = down ? layers.slice(1) : layers.slice(0, -1).reverse();
    for (const layer of sequence) {
      const scores = new Map(layer.map((id) => [id, barycenter(id, down ? predecessors.get(id)! : successors.get(id)!)]));
      layer.sort((a, b) => scores.get(a)! - scores.get(b)! || order.get(a)! - order.get(b)!);
      layer.forEach((id, i) => order.set(id, i));
    }
  }

  // --- coordinates
  const horizontal = isHorizontal(options.direction);
  const mainSize = (n: LayoutNode) => (horizontal ? n.width : n.height);
  const crossSize = (n: LayoutNode) => (horizontal ? n.height : n.width);
  const layerCrossExtent = layers.map((layer) =>
    layer.reduce((sum, id, i) => sum + crossSize(nodeById.get(id)!) + (i > 0 ? options.nodeSpacing : 0), 0),
  );
  const maxCross = Math.max(...layerCrossExtent);
  const positions: Record<string, XYPosition> = {};
  let main = 0;
  layers.forEach((layer, layerIndex) => {
    const layerMain = Math.max(...layer.map((id) => mainSize(nodeById.get(id)!)));
    let cross = (maxCross - layerCrossExtent[layerIndex]) / 2;
    for (const id of layer) {
      const node = nodeById.get(id)!;
      const mainOffset = (layerMain - mainSize(node)) / 2;
      positions[id] = horizontal
        ? { x: main + mainOffset, y: cross }
        : { x: cross, y: main + mainOffset };
      cross += crossSize(node) + options.nodeSpacing;
    }
    main += layerMain + options.rankSpacing;
  });

  // --- reverse direction for BT / RL
  if (options.direction === "BT" || options.direction === "RL") {
    const extent = main - options.rankSpacing;
    for (const node of nodes) {
      const p = positions[node.id];
      positions[node.id] = horizontal
        ? { x: extent - p.x - node.width, y: p.y }
        : { x: p.x, y: extent - p.y - node.height };
    }
  }
  return normalizePositions(positions, nodes, options.origin);
}

export const layeredLayout: LayoutAlgorithm = {
  name: "layered",
  compute: (graph) => ({ positions: computeLayered(graph) }),
};
