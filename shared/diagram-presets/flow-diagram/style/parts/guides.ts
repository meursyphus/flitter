import { SizedBox } from "flitterjs";
import { LayoutBuilder, type Widget } from "flitterjs";
import type {
  GuidesCustomArgs,
  FlowDiagramContext,
} from "@flitterjs/diagram";
import type { DefaultFlowConfig } from "../config";
import { ShapePaint } from "./paint";

/** Local coordinates inside the guide overlay; controller.guides stays in flow coordinates. */
export function defaultGuides(
  { lines }: GuidesCustomArgs,
  ctx: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  if (!lines.length) return SizedBox.shrink();
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
