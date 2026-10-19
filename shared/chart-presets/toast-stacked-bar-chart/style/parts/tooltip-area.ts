import type { Widget } from "flitterjs";
import type { BarChartCustom } from "@flitterjs/chart";
import type { ToastStackedBarChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBar }, ctx]: Parameters<
    BarChartCustom<ToastStackedBarChartConfig>["tooltipArea"]
  >
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hoveredBar,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "bar",
      direction: ctx.direction,
      value: hoveredBar?.value ?? 0,
    },
  });
}
