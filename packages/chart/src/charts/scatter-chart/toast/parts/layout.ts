import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: ScatterChartContext<ToastScatterChartConfig>
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
