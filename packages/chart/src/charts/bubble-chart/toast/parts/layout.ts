import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  args: { title: Widget; legends: Widget[]; plot: Widget },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return sharedLayout(args, context);
}
