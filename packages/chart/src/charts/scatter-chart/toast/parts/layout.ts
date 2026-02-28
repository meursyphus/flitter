import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastLayout as sharedLayout } from "@shared/toast";

export function toastLayout(
  args: { title: Widget; legends: Widget[]; plot: Widget },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  return sharedLayout(args, context);
}
