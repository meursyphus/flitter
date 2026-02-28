import type { Widget } from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { toastLegend as sharedLegend } from "@shared/toast";

export function toastLegend(
  { name, index }: { name: string; index: number },
  context: BarChartContext<ToastStackedBarChartConfig>
): Widget {
  const { colors, font } = context.config;
  const color = colors[index % colors.length];
  const visible = context.isSeriesVisible(name);

  return sharedLegend({
    name,
    visible,
    color,
    fontFamily: font.family,
    fontSize: font.size,
    onToggle: () => context.toggleSeries(name),
  });
}
