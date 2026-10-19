import type { Widget } from "flitterjs";
import type { SankeyChartCustom } from "@flitterjs/chart";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<SankeyChartCustom<SankeyChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
