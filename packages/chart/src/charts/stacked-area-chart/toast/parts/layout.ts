import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function createToastLayout(vc: ToastStackedAreaChartConfig) {
  return function toastLayout(
    ...[{ title, legends, plot }]: Parameters<StackedAreaChartCustom["layout"]>
  ): Widget {
    const { padding, title: titleConfig, legend: legendConfig } = vc;
    return sharedLayout({
      title,
      plot,
      legends,
      padding,
      titleConfig,
      legendConfig,
    });
  };
}
