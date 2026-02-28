import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  { name }: { name: string },
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { title, font } = context.config;
  return sharedTitle({
    name,
    fontFamily: title.fontFamily ?? font.family,
    fontSize: title.fontSize,
    fontWeight: title.fontWeight,
    color: title.color,
  });
}
