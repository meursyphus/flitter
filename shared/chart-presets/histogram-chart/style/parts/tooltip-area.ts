import type { Widget } from "flitter-core";
import type { HistogramChartCustom } from "flitter-ui/chart";
import type { HistogramChartConfig } from "../config";
import { cartesian } from "../../../_styles/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<HistogramChartCustom<HistogramChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
