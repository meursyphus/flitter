import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";
import { toastYAxisTick as sharedYAxisTick } from "@shared/toast";

export function toastYAxisTick(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
