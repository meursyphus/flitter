import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { toastXAxisLine as sharedXAxisLine } from "@shared/toast";

export function toastXAxisLine(
  _args: undefined,
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisLine({ color: axis.color, thickness: axis.thickness });
}
