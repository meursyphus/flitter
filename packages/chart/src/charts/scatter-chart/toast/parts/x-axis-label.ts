import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastXAxisLabel as sharedXAxisLabel } from "@shared/toast";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  return sharedXAxisLabel(args, context);
}
