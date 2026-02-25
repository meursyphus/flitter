import { Container, type Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";

export function toastGridXLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { grid } = context.config;
  return Container({ height: grid.thickness, color: grid.color });
}
