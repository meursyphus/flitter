import type { Widget } from "flitter-core";
import type {
  EdgeHandleCustomArgs,
  FlowDiagramContext,
} from "../../../../../../../src/engine";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

export function defaultEdgeHandle(
  { isActive }: EdgeHandleCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  return ShapePaint({
    width: 8,
    height: 8,
    shapes: {
      pin: {
        d: rectPathD(0.5, 0.5, 7, 7),
        fill: isActive
          ? ctx.config.colors.selectionBorder
          : ctx.config.colors.nodeBackground,
        stroke: ctx.config.colors.nodeBorder,
        strokeWidth: 1,
      },
    },
  });
}
