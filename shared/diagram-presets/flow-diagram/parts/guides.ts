import { Positioned, Stack, type Widget } from "flitter-ui";
import type { GuidesBuilderArgs, FlowContext } from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint } from "./paint";

export function defaultGuides({ lines }: GuidesBuilderArgs, ctx: FlowContext<DefaultFlowConfig>): Widget | null {
  if (!lines.length) return null;
  return Stack({
    children: lines.map(({ from, to }) => {
      const x = Math.min(from.x, to.x),
        y = Math.min(from.y, to.y);
      return Positioned({
        left: x,
        top: y,
        child: ShapePaint({
          width: Math.max(1, Math.abs(to.x - from.x)),
          height: Math.max(1, Math.abs(to.y - from.y)),
          shapes: {
            guide: {
              d: `M ${from.x - x} ${from.y - y} L ${to.x - x} ${to.y - y}`,
              stroke: ctx.config.colors.selectionBorder,
              strokeWidth: 1,
              dash: [4, 4],
            },
          },
        }),
      });
    }),
  });
}
