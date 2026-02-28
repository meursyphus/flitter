import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "./config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function toastXAxisTick(
  _args: undefined,
  context: BarChartContext<ToastBarChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
