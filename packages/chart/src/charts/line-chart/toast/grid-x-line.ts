import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "./config";
import { toastGridXLine as sharedGridXLine } from "@shared/toast";

export function toastGridXLine(
  _args: undefined,
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridXLine({ thickness: grid.thickness, color: grid.color });
}
