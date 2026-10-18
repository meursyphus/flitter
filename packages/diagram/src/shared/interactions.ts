import type { FlowNode, XYPosition, Rect } from "../headless/flow/types";
import { getOverlappingArea } from "./geometry";

export function isDescendant(nodes: FlowNode[], id: string, ancestor: string): boolean {
  const seen = new Set<string>();
  let node = nodes.find((node) => node.id === id);
  while (node?.parentId && !seen.has(node.parentId)) {
    if (node.parentId === ancestor) return true;
    seen.add(node.parentId);
    node = nodes.find((n) => n.id === node!.parentId);
  }
  return false;
}

export function pushApart(
  rects: (Rect & { id: string })[],
  ids: string[],
  options: { margin?: number; overlapThreshold?: number } = {},
): Record<string, XYPosition> {
  const boxes = rects.map((rect) => ({ ...rect }));
  const moving = new Set(ids),
    margin = options.margin ?? 8,
    threshold = options.overlapThreshold ?? 0;
  for (let iteration = 0; iteration < 32; iteration++) {
    let changed = false;
    for (const box of boxes) {
      if (!moving.has(box.id)) continue;
      for (const other of boxes) {
        if (other.id === box.id) continue;
        const area = getOverlappingArea(box, other);
        if (area <= Math.min(box.width * box.height, other.width * other.height) * threshold) continue;
        const dx = Math.min(box.x + box.width - other.x, other.x + other.width - box.x);
        const dy = Math.min(box.y + box.height - other.y, other.y + other.height - box.y);
        if (dx < dy) box.x += (box.x + box.width / 2 >= other.x + other.width / 2 ? 1 : -1) * (dx + margin);
        else box.y += (box.y + box.height / 2 >= other.y + other.height / 2 ? 1 : -1) * (dy + margin);
        changed = true;
      }
    }
    if (!changed) break;
  }
  return Object.fromEntries(boxes.filter((box) => moving.has(box.id)).map((box) => [box.id, { x: box.x, y: box.y }]));
}

/** Tree collapse preserves paths from visible outsiders; body collapse is one level deep. */
export function collapseSets(nodes: FlowNode[], edges: { source: string; target: string }[]): Map<string, Set<string>> {
  const lookup = new Map(nodes.map((node) => [node.id, node]));
  const outgoing = new Map<string, string[]>();
  for (const edge of edges) {
    if (!lookup.has(edge.source) || !lookup.has(edge.target)) continue;
    const targets = outgoing.get(edge.source) ?? [];
    targets.push(edge.target);
    outgoing.set(edge.source, targets);
  }
  const trees = new Map<string, Set<string>>(),
    bodies = new Map<string, Set<string>>();
  for (const root of nodes.filter((node) => node.collapsed)) {
    const targets = outgoing.get(root.id) ?? [];
    if (!targets.length) {
      bodies.set(root.id, new Set(nodes.filter((node) => node.parentId === root.id).map((node) => node.id)));
      continue;
    }
    const reached = new Set<string>(),
      queue = [...targets];
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i];
      if (id === root.id || reached.has(id)) continue;
      reached.add(id);
      queue.push(...(outgoing.get(id) ?? []));
    }
    trees.set(root.id, reached);
  }

  const bodyHidden = new Set([...bodies.values()].flatMap((ids) => [...ids]));
  const candidates = new Set([...bodyHidden, ...[...trees.values()].flatMap((ids) => [...ids])]);
  // Only nodes outside the candidate subtrees seed alternate visible paths.
  // In particular, a cycle inside a collapsed subtree cannot rescue itself.
  const visible = new Set(nodes.filter((node) => !node.hidden && !candidates.has(node.id)).map((node) => node.id));
  const queue = [...visible];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    if (lookup.get(id)?.collapsed) continue;
    for (const target of outgoing.get(id) ?? []) {
      if (visible.has(target) || bodyHidden.has(target) || lookup.get(target)?.hidden) continue;
      visible.add(target);
      queue.push(target);
    }
  }
  const result = new Map(bodies);
  for (const [id, reached] of trees) result.set(id, new Set([...reached].filter((target) => !visible.has(target))));
  return result;
}

export function alignmentPositions(
  rects: (Rect & { id: string })[],
  mode: "left" | "centerX" | "right" | "top" | "centerY" | "bottom",
): Record<string, XYPosition> {
  if (!rects.length) return {};
  const left = Math.min(...rects.map((r) => r.x)),
    right = Math.max(...rects.map((r) => r.x + r.width));
  const top = Math.min(...rects.map((r) => r.y)),
    bottom = Math.max(...rects.map((r) => r.y + r.height));
  return Object.fromEntries(
    rects.map((rect) => [
      rect.id,
      {
        x:
          mode === "left"
            ? left
            : mode === "right"
              ? right - rect.width
              : mode === "centerX"
                ? (left + right - rect.width) / 2
                : rect.x,
        y:
          mode === "top"
            ? top
            : mode === "bottom"
              ? bottom - rect.height
              : mode === "centerY"
                ? (top + bottom - rect.height) / 2
                : rect.y,
      },
    ]),
  );
}

export function distributionPositions(rects: (Rect & { id: string })[], axis: "x" | "y"): Record<string, XYPosition> {
  if (rects.length < 3) return {};
  const size = axis === "x" ? "width" : "height",
    sorted = [...rects].sort((a, b) => a[axis] - b[axis]);
  const first = sorted[0],
    last = sorted[sorted.length - 1];
  const gap =
    (last[axis] + last[size] - first[axis] - sorted.reduce((sum, rect) => sum + rect[size], 0)) / (sorted.length - 1);
  let cursor = first[axis];
  return Object.fromEntries(
    sorted.map((rect) => {
      const position = { x: rect.x, y: rect.y, [axis]: cursor };
      cursor += rect[size] + gap;
      return [rect.id, position];
    }),
  );
}
