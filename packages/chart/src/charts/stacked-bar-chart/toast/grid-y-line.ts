import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "./config";
import { toastGridYLine as sharedGridYLine } from "@shared/toast";

export function toastGridYLine(
  _args: undefined,
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridYLine({ thickness: grid.thickness, color: grid.color });
}
