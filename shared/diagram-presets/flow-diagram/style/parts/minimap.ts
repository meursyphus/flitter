import { Positioned, SizedBox, Stack } from "flitter-ui";
import type { FlowDiagramCustom } from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

type Parts = FlowDiagramCustom<DefaultFlowConfig>;
export const defaultMinimap: Parts["minimap"] = ({
  width,
  height,
  background,
  nodes,
  mask,
  viewport,
}) =>
  SizedBox({
    width,
    height,
    child: Stack({ children: [background, ...nodes, mask, viewport] }),
  });

export const defaultMinimapBackground: Parts["minimapBackground"] = (
  { width, height },
  ctx,
) =>
  ShapePaint({
    width,
    height,
    shapes: {
      background: {
        d: rectPathD(0, 0, width, height),
        fill: ctx.config.colors.minimapBackground,
      },
    },
  });

export const defaultMinimapNode: Parts["minimapNode"] = ({ rect }, ctx) =>
  Positioned({
    left: rect.x,
    top: rect.y,
    child: ShapePaint({
      width: rect.width,
      height: rect.height,
      shapes: {
        node: {
          d: rectPathD(
            0,
            0,
            rect.width,
            rect.height,
            Math.min(ctx.config.minimap.nodeBorderRadius, rect.height / 2),
          ),
          fill: ctx.config.minimap.nodeColor ?? ctx.config.colors.minimapNode,
        },
      },
    }),
  });

export const defaultMinimapViewport: Parts["minimapViewport"] = (
  { rect },
  ctx,
) =>
  Positioned({
    left: rect.x,
    top: rect.y,
    child: ShapePaint({
      width: rect.width,
      height: rect.height,
      shapes: {
        viewport: {
          d: rectPathD(0, 0, rect.width, rect.height),
          stroke: ctx.config.colors.minimapViewportStroke,
          strokeWidth: ctx.config.minimap.viewportStrokeWidth,
        },
      },
    }),
  });

export const defaultMinimapMask: Parts["minimapMask"] = (
  { width, height, rect },
  ctx,
) => {
  const right = rect.x + rect.width,
    bottom = rect.y + rect.height;
  return ShapePaint({
    width,
    height,
    shapes: {
      mask: {
        d: [
          rectPathD(0, 0, width, rect.y),
          rectPathD(0, bottom, width, height - bottom),
          rectPathD(0, rect.y, rect.x, rect.height),
          rectPathD(right, rect.y, width - right, rect.height),
        ].join(""),
        fill: ctx.config.minimap.maskColor ?? ctx.config.colors.minimapMask,
      },
    },
  });
};
