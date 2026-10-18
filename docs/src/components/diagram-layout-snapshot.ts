import { Matrix4, type RenderObject } from "flitter-core";
import { RenderFlowNodeItem } from "flitter-ui/diagram";

type Box = { x: number; y: number; width: number; height: number };
export type DiagramLayoutSnapshot = {
  nodes: (Box & { id: string; scale: number })[];
  panels: (Box & { role: string })[];
};

/** Read actual, unclipped layout bounds on demand. Works for SVG and Canvas without repainting. */
export function diagramLayoutSnapshot(
  root: RenderObject,
): DiagramLayoutSnapshot {
  const snapshot: DiagramLayoutSnapshot = { nodes: [], panels: [] };
  function visit(render: RenderObject, parent: Matrix4) {
    const transform = parent.translated(render.offset.x, render.offset.y);
    const m = transform.storage;
    const corners = [
      [0, 0],
      [render.size.width, 0],
      [0, render.size.height],
      [render.size.width, render.size.height],
    ];
    const xs = corners.map(([x, y]) => m[0] * x + m[4] * y + m[12]);
    const ys = corners.map(([x, y]) => m[1] * x + m[5] * y + m[13]);
    const box = {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
    if (render instanceof RenderFlowNodeItem)
      snapshot.nodes.push({
        id: render.measureId,
        scale: Math.hypot(m[0], m[1]),
        ...box,
      });
    const key = render.ownerElement.widget.key;
    if (
      (key === "diagram-hint" ||
        key === "diagram-status" ||
        key === "diagram-header") &&
      box.width > 0 &&
      box.height > 0
    )
      snapshot.panels.push({ role: key, ...box });
    const childTransform = render.applyPaintTransform(transform);
    render.visitChildren((child) => visit(child, childTransform));
  }
  visit(root, Matrix4.identity());
  return snapshot;
}
