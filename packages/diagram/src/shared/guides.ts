import type { Guide, Rect } from "../headless/flow-diagram/types";

export function snapBounds(rect: Rect, others: Rect[], radius: number, anchors: { x?: number[]; y?: number[] } = {}) {
  let dx = 0,
    dy = 0,
    fx = 1,
    fy = 1;
  const lines: Guide[] = [];
  for (const axis of ["x", "y"] as const) {
    const size = axis === "x" ? "width" : "height",
      cross = axis === "x" ? "y" : "x",
      crossSize = axis === "x" ? "height" : "width";
    let best = radius + 1,
      match: Guide | null = null,
      fraction = 1;
    for (const other of others)
      for (const a of anchors[axis] ?? [0, 0.5, 1])
        for (const b of [0, 0.5, 1]) {
          const position = other[axis] + other[size] * b;
          const delta = position - (rect[axis] + rect[size] * a);
          if (Math.abs(delta) > radius || Math.abs(delta) >= Math.abs(best)) continue;
          best = delta;
          fraction = a;
          match = {
            axis,
            position,
            from: Math.min(rect[cross], other[cross]),
            to: Math.max(rect[cross] + rect[crossSize], other[cross] + other[crossSize]),
          };
        }
    if (match) {
      lines.push(match);
      if (axis === "x") {
        dx = best;
        fx = fraction;
      } else {
        dy = best;
        fy = fraction;
      }
    }
  }
  return { dx, dy, fx, fy, lines };
}
