import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { toastYAxisLine as sharedYAxisLine } from "@shared/toast";

export function toastYAxisLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisLine({ color: axis.color, thickness: axis.thickness });
}
