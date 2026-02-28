import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastLegend as sharedLegend } from "@shared/toast";

export function toastLegend(
  args: { name: string; index: number },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  return sharedLegend(args, context);
}
