import type { Widget } from "flitterjs";
import type { HistogramChartCustom } from "@flitterjs/chart";
import type { HistogramChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
