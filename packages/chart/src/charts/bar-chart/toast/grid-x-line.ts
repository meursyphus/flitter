import { Container } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastGridXLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
) {
  return Container({ height: 1, color: context.config.gridColor });
}
