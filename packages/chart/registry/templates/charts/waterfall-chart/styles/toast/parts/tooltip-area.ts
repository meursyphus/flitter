import type { Widget } from "flitter-core";
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBar }, ctx]: Parameters<
    WaterfallChartCustom<WaterfallChartConfig>["tooltipArea"]
  >
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hoveredBar,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "bar",
      direction: "vertical",
      value: hoveredBar?.item.value ?? 0,
    },
  });
}
