import { LayoutBuilder, type Widget } from "flitter-ui";
import type { GuidesBuilderArgs, FlowContext } from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint } from "./paint";

/** Local coordinates inside the guide overlay; controller.guides stays in flow coordinates. */
export function defaultGuides({ lines }: GuidesBuilderArgs, ctx: FlowContext<DefaultFlowConfig>): Widget | null {
  if (!lines.length) return null;
  return LayoutBuilder({
    builder: (_context, constraints) =>
      ShapePaint({
        width: constraints.maxWidth,
        height: constraints.maxHeight,
        shapes: Object.fromEntries(
          lines.map((line, index) => [
            String(index),
            {
              d:
                line.axis === "x"
                  ? `M ${line.position} ${line.from} L ${line.position} ${line.to}`
                  : `M ${line.from} ${line.position} L ${line.to} ${line.position}`,
              stroke: ctx.config.colors.selectionBorder,
              strokeWidth: 1,
              dash: [4, 4],
            },
          ]),
        ),
      }),
  });
}
