import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastYAxisTick as sharedYAxisTick } from "@shared/toast";

export function toastYAxisTick(
  _args: undefined,
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedYAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
