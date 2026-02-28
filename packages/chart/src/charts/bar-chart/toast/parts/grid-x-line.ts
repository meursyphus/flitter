import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { toastGridXLine as sharedGridXLine } from "@shared/toast";

export function toastGridXLine(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { grid } = context.config;
  return sharedGridXLine({ thickness: grid.thickness, color: grid.color });
}
