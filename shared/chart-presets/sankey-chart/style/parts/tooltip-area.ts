import type { Widget } from "flitter-core";
import type { SankeyChartCustom } from "flitter-ui/chart";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "../../../_styles/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<SankeyChartCustom<SankeyChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
