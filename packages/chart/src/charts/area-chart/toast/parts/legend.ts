import type { Widget } from "flitter-core";
import type { LineChartContext } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastLegend as sharedLegend } from "@shared/toast";

export function toastLegend(
  { name, index }: { name: string; index: number },
  context: LineChartContext<ToastAreaChartConfig>
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
