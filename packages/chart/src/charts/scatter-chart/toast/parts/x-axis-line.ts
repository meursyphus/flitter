import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastXAxisLine as sharedXAxisLine } from "@shared/toast";

export function toastXAxisLine(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisLine({ color: axis.color, thickness: axis.thickness });
}
