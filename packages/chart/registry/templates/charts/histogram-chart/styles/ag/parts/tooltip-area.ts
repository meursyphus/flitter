import type { Widget } from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
