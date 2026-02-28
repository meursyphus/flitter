import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastYAxisTick as sharedYAxisTick } from "@shared/toast";

export function toastYAxisTick(
  _args: undefined,
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
