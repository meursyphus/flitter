import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "./config";
import { toastXAxisLine as sharedXAxisLine } from "@shared/toast";

export function toastXAxisLine(
  _args: undefined,
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisLine({ color: axis.color, thickness: axis.thickness });
}
