import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "./config";
import { toastAxisCorner as sharedAxisCorner } from "@shared/toast";

export function toastAxisCorner(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedAxisCorner({ color: axis.color, thickness: axis.thickness });
}
