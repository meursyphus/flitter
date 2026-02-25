import { SizedBox, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastLegend(
  _args: { name: string; index: number },
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  return SizedBox.shrink();
}
