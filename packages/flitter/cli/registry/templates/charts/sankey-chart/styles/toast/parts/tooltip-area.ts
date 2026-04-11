import type { Widget } from "flitter-core";
import type { SankeyChartCustom } from "@headless/sankey-chart/types";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
  ...[{ tooltip, hovered }, ctx]: Parameters<SankeyChartCustom<SankeyChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hovered,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "heatmap",
    },
  });
}
