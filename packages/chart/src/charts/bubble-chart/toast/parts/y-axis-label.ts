import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastYAxisLabel as sharedYAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  args: { name: string; index: number },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return sharedYAxisLabel(args, context);
}
