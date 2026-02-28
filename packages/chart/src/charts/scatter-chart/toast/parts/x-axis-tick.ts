import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function toastXAxisTick(
  _args: undefined,
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
