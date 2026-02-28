import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { toastAxisCorner as sharedAxisCorner } from "@shared/toast";

export function toastAxisCorner(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedAxisCorner({ color: axis.color, thickness: axis.thickness });
}
