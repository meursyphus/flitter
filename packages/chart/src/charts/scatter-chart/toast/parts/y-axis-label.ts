import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastYAxisLabel as sharedYAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  args: { name: string; index: number },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  return sharedYAxisLabel(args, context);
}
