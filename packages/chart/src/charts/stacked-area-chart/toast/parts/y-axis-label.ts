import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastAxisLabel } from "@shared/toast";

export function createToastYAxisLabel(vc: ToastStackedAreaChartConfig) {
  return function toastYAxisLabel(
    ...[{ name }]: Parameters<StackedAreaChartCustom["yAxisLabel"]>
  ): Widget {
    const { font, axis } = vc;
    return toastAxisLabel({
      name,
      fontFamily: font.family,
      fontSize: axis.label.fontSize,
      color: axis.label.color,
    });
  };
}
