import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { toastGridYLine as sharedGridYLine } from "@shared/toast";

export function toastGridYLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridYLine({ thickness: grid.thickness, color: grid.color });
}
