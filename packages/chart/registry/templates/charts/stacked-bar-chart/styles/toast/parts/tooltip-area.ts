import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { ToastStackedBarChartConfig } from "../config";
import { cartesian } from "@styles/toast";

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
