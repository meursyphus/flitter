import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";
import { toastXAxisLine as sharedXAxisLine } from "@shared/toast";

export function createToastXAxisLine(vc: ToastStackedAreaChartConfig) {
  return function toastXAxisLine(
    ..._args: Parameters<StackedAreaChartCustom["xAxisLine"]>
  ): Widget {
    const { axis } = vc;
    return sharedXAxisLine({ color: axis.color, thickness: axis.thickness });
  };
}
