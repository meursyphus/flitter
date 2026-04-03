import type { Widget } from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBin }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hoveredBin,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "bar",
      direction: "vertical",
      value: hoveredBin?.value ?? 0,
    },
  });
}
