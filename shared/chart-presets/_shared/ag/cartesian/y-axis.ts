import type { Widget } from "flitter-ui";
import type { AgCartesianBaseConfig } from "./config";
import { YAxis } from "flitter-ui/chart";

type AgAxisConfig = Pick<AgCartesianBaseConfig, "axis">;

export function agYAxis<TConfig extends AgAxisConfig>(
  { line, labels, tick }: { line: Widget; labels: Widget[]; tick: Widget },
  options: { type: "label" | "value" },
  context: { config: TConfig },
): Widget {
  return YAxis({ line, labels, tick }, {
    type: options.type,
    gap: context.config.axis.label.gap,
  });
}
