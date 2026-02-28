import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastYAxisLine as sharedYAxisLine } from "@shared/toast";

export function toastYAxisLine(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisLine({ color: axis.color, thickness: axis.thickness });
}
