import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "./config";
import { toastXAxisLine as sharedXAxisLine } from "@shared/toast";

export function toastXAxisLine(
  _args: undefined,
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  const { axis } = context.config;
  return sharedXAxisLine({ color: axis.color, thickness: axis.thickness });
}
