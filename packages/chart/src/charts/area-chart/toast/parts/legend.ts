import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastLegend as sharedLegend } from "@shared/toast";

export function toastLegend(
  args: { name: string; index: number },
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  return sharedLegend(args, context);
}
