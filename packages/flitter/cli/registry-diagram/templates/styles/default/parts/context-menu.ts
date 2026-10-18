import { Container, type Widget } from "flitter-core";
import type { ContextMenuBuilderArgs, FlowContext } from "../../../headless/flow/types";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint, rectPathD } from "./paint";

/** P2 supplies menu actions; this container is deliberately plain and editable. */
export function defaultContextMenu(_args: ContextMenuBuilderArgs, ctx: FlowContext<DefaultFlowConfig>): Widget {
  const { colors } = ctx.config;
  return Container({
    child: ShapePaint({
      width: 160,
      height: 32,
      shapes: {
        menu: {
          d: rectPathD(0.5, 0.5, 159, 31),
          fill: colors.nodeBackground,
          stroke: colors.nodeBorder,
          strokeWidth: 1,
        },
      },
    }),
  });
}
