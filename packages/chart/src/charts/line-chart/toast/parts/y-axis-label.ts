import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastYAxisLabel as sharedYAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  args: { name: string; index: number },
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  return sharedYAxisLabel(args, context);
}
