import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  args: { title: Widget; legends: Widget[]; plot: Widget },
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  return sharedLayout(args, context);
}
