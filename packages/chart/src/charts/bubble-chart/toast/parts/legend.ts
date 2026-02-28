import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastLegend as sharedLegend } from "@shared/toast";

export function toastLegend(
  args: { name: string; index: number },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return sharedLegend(args, context);
}
