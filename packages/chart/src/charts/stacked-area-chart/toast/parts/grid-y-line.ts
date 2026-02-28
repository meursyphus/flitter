import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastGridYLine as sharedGridYLine } from "@shared/toast";

export function createToastGridYLine(vc: ToastStackedAreaChartConfig) {
  return function toastGridYLine(
    ...[_args]: Parameters<StackedAreaChartCustom["gridYLine"]>
  ): Widget {
    return sharedGridYLine(_args, { config: vc });
  };
}
