import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastYAxisLabel as sharedYAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  args: { name: string; index: number },
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  return sharedYAxisLabel(args, context);
}
