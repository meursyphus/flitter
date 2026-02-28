import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastGridYLine as sharedGridYLine } from "@shared/toast";

export function toastGridYLine(
  _args: undefined,
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridYLine({ thickness: grid.thickness, color: grid.color });
}
