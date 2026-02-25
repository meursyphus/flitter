import { Container } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastYAxisLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
) {
  return Container({ color: context.config.axisColor, width: 1, height: Infinity });
}
