import type { Widget } from "flitterjs";
import type { WaterfallChartCustom } from "@flitterjs/chart";
import type { WaterfallChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({ tooltip, enabled: ctx.config.tooltip.enabled });
}
