import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastYAxisLine as sharedYAxisLine } from "@shared/toast";

export function toastYAxisLine(
  _args: undefined,
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisLine({ color: axis.color, thickness: axis.thickness });
}
