import type { Widget } from "flitter-core";
import type { AgBaseConfig } from "./config";
import { XAxis } from "../../../cartesian";

export function agXAxis(
  { line, labels, tick }: { line: Widget; labels: Widget[]; tick: Widget },
  options: { type: "label" | "value" },
  context: { config: AgBaseConfig },
): Widget {
  return XAxis({ line, labels, tick }, {
    type: options.type,
    gap: context.config.axis.label.gap,
  });
}
