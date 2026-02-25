import { Container } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastXAxisLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
) {
  return Container({ color: context.config.axisColor, height: 1, width: Infinity });
}
