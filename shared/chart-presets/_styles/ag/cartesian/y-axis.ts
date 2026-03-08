import type { Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./config";
import { YAxis } from "flitter-ui/chart";

export function agYAxis(
  { line, labels, tick }: { line: Widget; labels: Widget[]; tick: Widget },
  options: { type: "label" | "value" },
  context: { config: AgCartesianBaseConfig },
): Widget {
  return YAxis({ line, labels, tick }, {
    type: options.type,
    gap: context.config.axis.label.gap,
  });
}
