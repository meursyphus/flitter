import type { Widget } from "flitter-ui";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
