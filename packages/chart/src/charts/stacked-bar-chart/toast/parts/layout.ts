import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { padding, title: titleConfig, legend: legendConfig } = context.config;
  return sharedLayout({
    title,
    plot,
    legends,
    padding,
    titleConfig,
    legendConfig,
  });
}
