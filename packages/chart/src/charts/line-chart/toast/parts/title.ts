import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastTitle as sharedTitle } from "@shared/toast";

export function toastTitle(
  args: { name: string },
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  return sharedTitle(args, context);
}
