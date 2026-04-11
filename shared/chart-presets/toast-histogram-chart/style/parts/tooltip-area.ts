import type { Widget } from "flitter-ui";
import type { HistogramChartCustom } from "flitter-ui/chart";
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
