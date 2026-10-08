import type { XYPosition, Dimensions } from "./geometry";

type NodeLike = {
  id: string;
  position: XYPosition;
  measured?: Dimensions;
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  resizing?: boolean;
  parentId?: string;
};

type EdgeLike = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  selected?: boolean;
};

export type NodeChange<N extends NodeLike = NodeLike> =
  | { type: "position"; id: string; position?: XYPosition; dragging?: boolean }
  | { type: "dimensions"; id: string; dimensions: Dimensions; setAttributes?: boolean; resizing?: boolean }
  | { type: "select"; id: string; selected: boolean }
  | { type: "remove"; id: string }
  | { type: "add"; item: N; index?: number }
  | { type: "replace"; id: string; item: N };

export type EdgeChange<E extends EdgeLike = EdgeLike> =
  | { type: "select"; id: string; selected: boolean }
  | { type: "remove"; id: string }
  | { type: "add"; item: E; index?: number }
  | { type: "replace"; id: string; item: E };

export type Connection = {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
};

function applyChange<T extends { id: string }>(
  change: { type: string; id?: string; item?: T; index?: number; [key: string]: unknown },
  items: T[],
  apply: (item: T, change: any) => T,
): T[] {
  switch (change.type) {
    case "add": {
      const next = [...items];
      const index = change.index ?? next.length;
      next.splice(index, 0, change.item as T);
      return next;
    }
    case "remove":
      return items.filter((item) => item.id !== change.id);
    case "replace":
      return items.map((item) => (item.id === change.id ? (change.item as T) : item));
    default:
      return items.map((item) => (item.id === change.id ? apply(item, change) : item));
  }
}

/** Apply engine-emitted node changes to a node array (React Flow's `applyNodeChanges`). */
export function applyNodeChanges<N extends NodeLike>(changes: NodeChange<N>[], nodes: N[]): N[] {
  let next = nodes;
  for (const change of changes) {
    next = applyChange(change as any, next, (node: N, c: NodeChange<N>): N => {
      switch (c.type) {
        case "position": {
          const updated = { ...node } as N;
          if (c.position) updated.position = c.position;
          if (typeof c.dragging !== "undefined") updated.dragging = c.dragging;
          return updated;
        }
        case "dimensions": {
          const updated = { ...node, measured: { ...c.dimensions } } as N;
          if (c.setAttributes) {
            updated.width = c.dimensions.width;
            updated.height = c.dimensions.height;
          }
          if (typeof c.resizing !== "undefined") updated.resizing = c.resizing;
          return updated;
        }
        case "select":
          return { ...node, selected: c.selected } as N;
        default:
          return node;
      }
    });
  }
  return next;
}

/** Apply engine-emitted edge changes to an edge array (React Flow's `applyEdgeChanges`). */
export function applyEdgeChanges<E extends EdgeLike>(changes: EdgeChange<E>[], edges: E[]): E[] {
  let next = edges;
  for (const change of changes) {
    next = applyChange(change as any, next, (edge: E, c: EdgeChange<E>): E => {
      if (c.type === "select") return { ...edge, selected: c.selected } as E;
      return edge;
    });
  }
  return next;
}

export function getEdgeId({ source, sourceHandle, target, targetHandle }: Connection): string {
  return `xy-edge__${source}${sourceHandle ?? ""}-${target}${targetHandle ?? ""}`;
}

export function connectionExists(edge: EdgeLike, edges: EdgeLike[]): boolean {
  return edges.some(
    (el) =>
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle)),
  );
}

/** Add an edge for a connection unless an identical connection already exists (React Flow's `addEdge`). */
export function addEdge<E extends EdgeLike>(edgeParams: (Partial<E> & Connection) | E, edges: E[]): E[] {
  if (!edgeParams.source || !edgeParams.target) return edges;
  const hasId = typeof (edgeParams as E).id === "string" && (edgeParams as E).id.length > 0;
  const edge = {
    ...edgeParams,
    id: hasId ? (edgeParams as E).id : getEdgeId(edgeParams as Connection),
  } as E;
  if (connectionExists(edge, edges)) return edges;
  if (edge.sourceHandle === null) delete (edge as Partial<EdgeLike>).sourceHandle;
  if (edge.targetHandle === null) delete (edge as Partial<EdgeLike>).targetHandle;
  return edges.concat(edge);
}

/** Replace an edge's endpoints with a new connection (React Flow's `reconnectEdge`). */
export function reconnectEdge<E extends EdgeLike>(
  oldEdge: E,
  newConnection: Connection,
  edges: E[],
  options: { shouldReplaceId?: boolean } = { shouldReplaceId: true },
): E[] {
  if (!newConnection.source || !newConnection.target) return edges;
  if (!edges.some((e) => e.id === oldEdge.id)) return edges;
  const { id: oldEdgeId, ...rest } = oldEdge;
  const edge = {
    ...rest,
    id: options.shouldReplaceId ? getEdgeId(newConnection) : oldEdgeId,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  } as E;
  return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
}

export function getConnectedEdges<N extends { id: string }, E extends EdgeLike>(nodes: N[], edges: E[]): E[] {
  const ids = new Set(nodes.map((n) => n.id));
  return edges.filter((e) => ids.has(e.source) || ids.has(e.target));
}

export function getIncomers<N extends { id: string }, E extends EdgeLike>(node: N | { id: string }, nodes: N[], edges: E[]): N[] {
  const incomerIds = new Set(edges.filter((e) => e.target === node.id).map((e) => e.source));
  return nodes.filter((n) => incomerIds.has(n.id));
}

export function getOutgoers<N extends { id: string }, E extends EdgeLike>(node: N | { id: string }, nodes: N[], edges: E[]): N[] {
  const outgoerIds = new Set(edges.filter((e) => e.source === node.id).map((e) => e.target));
  return nodes.filter((n) => outgoerIds.has(n.id));
}
