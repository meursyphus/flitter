import type { Widget } from "flitter-core";
import type { SankeyChartCustom } from "flitter-ui/chart";
import type { SankeyChartConfig } from "../config";
import { cartesian } from "../../../_styles/toast/index";

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
