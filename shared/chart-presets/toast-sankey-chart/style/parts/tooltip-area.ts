import type { Widget } from "flitter-ui";
import type { SankeyChartCustom } from "flitter-ui/chart";
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
