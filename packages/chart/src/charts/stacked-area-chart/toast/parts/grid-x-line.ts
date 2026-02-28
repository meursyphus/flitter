import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastGridXLine as sharedGridXLine } from "@shared/toast";

export function createToastGridXLine(vc: ToastStackedAreaChartConfig) {
  return function toastGridXLine(
    ...[_args]: Parameters<StackedAreaChartCustom["gridXLine"]>
  ): Widget {
    return sharedGridXLine(_args, { config: vc });
  };
}
