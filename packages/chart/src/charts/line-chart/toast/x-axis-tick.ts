import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "./config";
import { toastXAxisTick as sharedXAxisTick } from "@shared/toast";

export function toastXAxisTick(
  _args: undefined,
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisTick({
    tickSize: axis.tick.size,
    thickness: axis.thickness,
    color: axis.color,
  });
}
