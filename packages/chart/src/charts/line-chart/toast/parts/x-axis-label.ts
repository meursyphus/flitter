import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastXAxisLabel as sharedXAxisLabel } from "@shared/toast";

export function toastXAxisLabel(
  args: { name: string; index: number },
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  return sharedXAxisLabel(args, context);
}
