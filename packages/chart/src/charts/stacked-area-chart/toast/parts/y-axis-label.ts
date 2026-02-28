import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastYAxisLabel as sharedYAxisLabel } from "@shared/toast";

export function createToastYAxisLabel(vc: ToastStackedAreaChartConfig) {
  return function toastYAxisLabel(
    ...[args]: Parameters<StackedAreaChartCustom["yAxisLabel"]>
  ): Widget {
    return sharedYAxisLabel(args, { config: vc });
  };
}
