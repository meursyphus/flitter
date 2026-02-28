import type { Widget } from "flitter-core";
import type { BubbleChartContext } from "@headless/bubble-chart/types";
import type { ToastBubbleChartConfig } from "../config";
import { toastGridYLine as sharedGridYLine } from "@shared/toast";

export function toastGridYLine(
  _args: undefined,
  context: BubbleChartContext<ToastBubbleChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridYLine({ thickness: grid.thickness, color: grid.color });
}
