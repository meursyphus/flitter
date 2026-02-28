import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastXAxisLabel as sharedXAxisLabel } from "@shared/toast";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  return sharedXAxisLabel(args, context);
}
