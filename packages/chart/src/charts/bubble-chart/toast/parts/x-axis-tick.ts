import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function toastXAxisTick(
  _args: undefined,
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
