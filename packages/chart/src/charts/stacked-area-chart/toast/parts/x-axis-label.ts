import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastXAxisLabel as sharedXAxisLabel } from "@shared/toast";

export function createToastXAxisLabel(vc: ToastStackedAreaChartConfig) {
  return function toastXAxisLabel(
    ...[args]: Parameters<StackedAreaChartCustom["xAxisLabel"]>
  ): Widget {
    return sharedXAxisLabel(args, { config: vc });
  };
}
