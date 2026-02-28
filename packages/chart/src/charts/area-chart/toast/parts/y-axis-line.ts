import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastYAxisLine as sharedYAxisLine } from "@shared/toast";

export function toastYAxisLine(
  _args: undefined,
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisLine({ color: axis.color, thickness: axis.thickness });
}
