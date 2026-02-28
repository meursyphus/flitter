import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastYAxisLine as sharedYAxisLine } from "@shared/toast";

export function createToastYAxisLine(vc: ToastStackedAreaChartConfig) {
  return function toastYAxisLine(
    ...[_args]: Parameters<StackedAreaChartCustom["yAxisLine"]>
  ): Widget {
    return sharedYAxisLine(_args, { config: vc });
  };
}
