import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBar }, ctx]: Parameters<BarChartCustom<ToastBarChartConfig>['tooltipArea']>
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
