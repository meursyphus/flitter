import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function createToastXAxisTick(vc: ToastStackedAreaChartConfig) {
  return function toastXAxisTick(
    ..._args: Parameters<StackedAreaChartCustom["xAxisTick"]>
  ): Widget {
    const { axis } = vc;
    return sharedXAxisTick({
      tickSize: axis.tick.size,
      thickness: axis.thickness,
      color: axis.color,
    });
  };
}
