import type RenderObject from "../../renderobject/RenderObject";
import { Matrix4, Offset, Rect, type Size } from "../../type";
import { transformPoint } from "../TransformationController";

export type ViewportClip = "hardEdge" | "none";
export const viewportClipper = (size: Size) =>
  Rect.fromLTWH({ left: 0, top: 0, width: size.width, height: size.height });

/** Convert client coordinates through the host and every ancestor paint transform. */
export function eventPosition(render: RenderObject, event: MouseEvent): Offset {
  const context = render.renderOwner.renderContext;
  const rect = context.view.getBoundingClientRect();
  const { scale, translation } = context.viewPort;
  const point = new Offset({
    x: (event.clientX - rect.left) / scale - translation.x,
    y: (event.clientY - rect.top) / scale - translation.y,
  });
  const chain: RenderObject[] = [];
  for (let node: RenderObject | undefined = render; node; node = node.parent)
    chain.push(node);
  let matrix = Matrix4.identity();
  for (let i = chain.length - 1; i >= 0; i--) {
    const node = chain[i];
    matrix = matrix.translated(node.offset.x, node.offset.y);
    if (node !== render) matrix = node.applyPaintTransform(matrix);
  }
  const inverse = Matrix4.identity();
  if (inverse.copyInverse(matrix) === 0) return Offset.zero();
  return transformPoint(inverse, point);
}

export function wheelPixels(
  event: WheelEvent,
  viewport: number,
  horizontal = false,
): number {
  const delta = horizontal ? event.deltaX || event.deltaY : event.deltaY;
  return (
    delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport : 1)
  );
}
