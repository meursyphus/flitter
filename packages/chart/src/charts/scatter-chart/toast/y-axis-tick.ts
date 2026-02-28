import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "./config";
import { toastYAxisTick as sharedYAxisTick } from "@shared/toast";

export function toastYAxisTick(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
