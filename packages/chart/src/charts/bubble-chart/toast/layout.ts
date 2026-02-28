import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "./config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  { title, plot, legends }: { title: Widget; legends: Widget[]; plot: Widget },
  context: BubbleChartContext<ToastBubbleChartConfig>
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
