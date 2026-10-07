import type { Widget } from "flitter-core";
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({ tooltip, enabled: ctx.config.tooltip.enabled });
}
