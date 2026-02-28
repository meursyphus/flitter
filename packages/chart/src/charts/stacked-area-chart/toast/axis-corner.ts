import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";
import { toastAxisCorner as sharedAxisCorner } from "@shared/toast";

export function createToastAxisCorner(vc: ToastStackedAreaChartConfig) {
  return function toastAxisCorner(
    ..._args: Parameters<StackedAreaChartCustom["axisCorner"]>
  ): Widget {
    const { axis } = vc;
    return sharedAxisCorner({ color: axis.color, thickness: axis.thickness });
  };
}
