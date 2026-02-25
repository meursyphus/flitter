import { Container } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastYAxisTick(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
) {
  return Container({ height: 1, width: 6, color: context.config.axisColor });
}
