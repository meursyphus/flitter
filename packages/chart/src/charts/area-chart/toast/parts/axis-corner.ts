import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastAxisCorner as sharedAxisCorner } from "@shared/toast";

export function toastAxisCorner(
  _args: undefined,
  context: LineChartContext<ToastAreaChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedAxisCorner({ color: axis.color, thickness: axis.thickness });
}
