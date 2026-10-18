import type { FlowContent, FlowNode, XYPosition } from "../headless/flow-diagram/types";
import { createId } from "./utils";

/** Remap a closed subgraph, preserving relative positions inside copied parents. */
export function remapContent(
  content: FlowContent,
  options: { at?: XYPosition; offset: XYPosition; select?: boolean },
): FlowContent {
  const ids = new Map(content.nodes.map((node) => [node.id, createId("node")]));
  const lookup = new Map(content.nodes.map(node => [node.id, node]));
  const absolute = content.nodes.map(node => {
    const point = { ...node.position }, seen = new Set([node.id]);
    let parentId = node.parentId;
    while (parentId && !seen.has(parentId)) {
      seen.add(parentId); const parent = lookup.get(parentId); if (!parent) break;
      point.x += parent.position.x; point.y += parent.position.y; parentId = parent.parentId;
    }
    return point;
  });
  const origin = absolute.length ? { x: Math.min(...absolute.map(point => point.x)), y: Math.min(...absolute.map(point => point.y)) } : { x: 0, y: 0 };
  const offset = options.at ? { x: options.at.x - origin.x, y: options.at.y - origin.y } : options.offset;
  return {
    nodes: content.nodes.map((node): FlowNode => {
      const parentId = node.parentId ? ids.get(node.parentId) : undefined;
      return {
        ...node,
        id: ids.get(node.id)!,
        parentId,
        position: parentId ? { ...node.position } : { x: node.position.x + offset.x, y: node.position.y + offset.y },
        data: { ...node.data },
        selected: options.select ?? true,
        dragging: false,
        resizing: false,
      };
    }),
    edges: content.edges
      .filter((edge) => ids.has(edge.source) && ids.has(edge.target))
      .map((edge) => ({
        ...edge,
        waypoints: edge.waypoints?.map((point) => ({ x: point.x + offset.x, y: point.y + offset.y })),
        id: createId("edge"),
        source: ids.get(edge.source)!,
        target: ids.get(edge.target)!,
        selected: false,
      })),
  };
}
