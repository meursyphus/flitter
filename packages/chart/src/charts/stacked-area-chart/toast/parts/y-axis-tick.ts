import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastYAxisTick as sharedYAxisTick } from "@shared/toast";

export function createToastYAxisTick(vc: ToastStackedAreaChartConfig) {
  return function toastYAxisTick(
    ...[_args]: Parameters<StackedAreaChartCustom["yAxisTick"]>
  ): Widget {
    return sharedYAxisTick(_args, { config: vc });
  };
}
