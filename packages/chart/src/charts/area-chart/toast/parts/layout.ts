import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: LineChartContext<ToastAreaChartConfig>
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
