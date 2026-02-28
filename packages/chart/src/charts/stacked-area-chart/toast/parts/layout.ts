import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function createToastLayout(vc: ToastStackedAreaChartConfig) {
  return function toastLayout(
    ...[args]: Parameters<StackedAreaChartCustom["layout"]>
  ): Widget {
    return sharedLayout(args, { config: vc });
  };
}
