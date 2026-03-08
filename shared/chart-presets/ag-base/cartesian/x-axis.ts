import type { Widget } from "flitter-core";
import type { AgCartesianBaseConfig } from "./config";
import { XAxis } from "../../_flitter/shared/cartesian/index";

export function agXAxis(
  { line, labels, tick }: { line: Widget; labels: Widget[]; tick: Widget },
  options: { type: "label" | "value" },
  context: { config: AgCartesianBaseConfig },
): Widget {
  return XAxis({ line, labels, tick }, {
    type: options.type,
    gap: context.config.axis.label.gap,
  });
}
