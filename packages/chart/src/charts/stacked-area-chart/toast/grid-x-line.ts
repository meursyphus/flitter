import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "./config";
import { toastGridXLine as sharedGridXLine } from "@shared/toast";

export function createToastGridXLine(vc: ToastStackedAreaChartConfig) {
  return function toastGridXLine(
    ..._args: Parameters<StackedAreaChartCustom["gridXLine"]>
  ): Widget {
    const { grid } = vc;
    return sharedGridXLine({ thickness: grid.thickness, color: grid.color });
  };
}
