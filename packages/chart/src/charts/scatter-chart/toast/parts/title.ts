import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  args: { name: string },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  return sharedTitle(args, context);
}
