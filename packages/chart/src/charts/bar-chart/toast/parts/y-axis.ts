import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { YAxis } from "@shared/cartesian/y-axis";

export function toastYAxis(
  {
    line,
    labels,
    tick,
  }: { line: Widget; labels: Widget[]; tick: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  return YAxis({ line, labels, tick }, {
    type: context.direction === "vertical" ? "value" : "label",
    gap: context.config.axis.label.gap,
  });
}
