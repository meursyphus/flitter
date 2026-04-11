import type { Widget } from "flitter-core";
import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<SankeyChartCustom<SankeyChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
