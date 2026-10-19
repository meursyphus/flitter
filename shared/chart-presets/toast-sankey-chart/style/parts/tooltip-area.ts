import type { Widget } from "flitterjs";
import type { SankeyChartCustom } from "@flitterjs/chart";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
