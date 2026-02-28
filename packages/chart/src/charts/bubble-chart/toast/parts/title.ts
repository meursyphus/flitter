import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  args: { name: string },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return sharedTitle(args, context);
}
