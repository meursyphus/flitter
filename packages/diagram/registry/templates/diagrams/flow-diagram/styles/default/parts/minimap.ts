import type { Widget } from "flitter-core";
import type {
  MinimapCustomArgs,
  FlowDiagramContext,
} from "../../../../../../../src/engine";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

export function defaultMinimap(
  args: MinimapCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { colors, minimap } = ctx.config;
  const elementWidth = minimap.width,
    elementHeight = minimap.height;
  const {
    viewportRect: viewBB,
    nodes: nodeRects,
    bounds: boundingRect,
    viewScale,
  } = args;
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;
  const offset = minimap.offsetScale * viewScale;
  const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const scale = elementWidth / width;
  const toLocal = (value: number, origin: number) => (value - origin) * scale;
  const nodesD = nodeRects
    .map(({ rect }) =>
      rectPathD(
        toLocal(rect.x, x),
        toLocal(rect.y, y),
        rect.width * scale,
        rect.height * scale,
        minimap.nodeBorderRadius * scale,
      ),
    )
    .join("");
  const left = Math.max(0, toLocal(viewBB.x, x));
  const top = Math.max(0, toLocal(viewBB.y, y));
  const right = Math.min(elementWidth, toLocal(viewBB.x + viewBB.width, x));
  const bottom = Math.min(elementHeight, toLocal(viewBB.y + viewBB.height, y));
  // Four outside strips leave a real hole under both SVG and Canvas's nonzero fill rule.
  const maskD = [
    rectPathD(0, 0, elementWidth, top),
    rectPathD(0, bottom, elementWidth, Math.max(0, elementHeight - bottom)),
    rectPathD(0, top, left, Math.max(0, bottom - top)),
    rectPathD(
      right,
      top,
      Math.max(0, elementWidth - right),
      Math.max(0, bottom - top),
    ),
  ].join("");

  const paint = ShapePaint({
    width: elementWidth,
    height: elementHeight,
    shapes: {
      background: {
        d: rectPathD(0, 0, elementWidth, elementHeight),
        fill: colors.minimapBackground,
      },
      nodes: nodesD
        ? { d: nodesD, fill: minimap.nodeColor ?? colors.minimapNode }
        : null,
      mask: {
        d: maskD,
        fill: minimap.maskColor ?? colors.minimapMask,
      },
      viewport: {
        d: rectPathD(
          left,
          top,
          Math.max(0, right - left),
          Math.max(0, bottom - top),
        ),
        stroke: colors.minimapViewportStroke,
        strokeWidth: minimap.viewportStrokeWidth,
      },
    },
  });
  return paint;
}
