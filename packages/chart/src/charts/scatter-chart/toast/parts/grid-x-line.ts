import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastGridXLine as sharedGridXLine } from "@shared/toast";

export function toastGridXLine(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridXLine({ thickness: grid.thickness, color: grid.color });
}
