import type { Widget } from "flitter-ui";
import type { EdgeHandleBuilderArgs, FlowContext } from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

export function defaultEdgeHandle({ active }: EdgeHandleBuilderArgs, ctx: FlowContext<DefaultFlowConfig>): Widget {
  return ShapePaint({
    width: 8,
    height: 8,
    shapes: {
      pin: {
        d: rectPathD(0.5, 0.5, 7, 7),
        fill: active ? ctx.config.colors.selectionBorder : ctx.config.colors.nodeBackground,
        stroke: ctx.config.colors.nodeBorder,
        strokeWidth: 1,
      },
    },
  });
}
