import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { XAxis } from "@shared/cartesian/x-axis";

export function toastXAxis(
  {
    line,
    labels,
    tick,
  }: { line: Widget; labels: Widget[]; tick: Widget },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  return XAxis({ line, labels, tick }, {
    type: context.direction === "vertical" ? "label" : "value",
    gap: context.config.axis.label.gap,
  });
}
