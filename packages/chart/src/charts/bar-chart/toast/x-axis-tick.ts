import { Container } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastXAxisTick(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
) {
  return Container({ height: 6, width: 1, color: context.config.axisColor });
}
