import type { Widget } from "flitter-core";
import type { ScatterChartContext } from "@headless/scatter-chart/types";
import type { ToastScatterChartConfig } from "../config";
import { toastAxisLabel } from "@shared/toast";

export function toastXAxisLabel(
  { name }: { name: string; index: number },
  context: ScatterChartContext<ToastScatterChartConfig>
): Widget {
  const { font, axis } = context.config;
  return toastAxisLabel({
    name,
    fontFamily: font.family,
    fontSize: axis.label.fontSize,
    color: axis.label.color,
  });
}
