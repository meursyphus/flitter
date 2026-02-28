import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "./config";
import { toastAxisLabel } from "@shared/toast";

export function toastXAxisLabel(
  { name }: { name: string; index: number },
  context: LineChartContext<ToastLineChartConfig>
): Widget {
  const { font, axis } = context.config;
  return toastAxisLabel({
    name,
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
