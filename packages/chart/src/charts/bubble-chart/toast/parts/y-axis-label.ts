import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastAxisLabel } from "@shared/toast";

export function toastYAxisLabel(
  { name }: { name: string; index: number },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { font, axis } = context.config;
  return toastAxisLabel({
    name,
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
