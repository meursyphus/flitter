import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "./config";
import { toastAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  { name }: { name: string; index: number },
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { font, axis } = context.config;
  return toastAxisLabel({
    name,
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
