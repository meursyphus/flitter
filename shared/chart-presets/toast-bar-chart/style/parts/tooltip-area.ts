import type { Widget } from "flitter-ui";
import type { BarChartCustom } from "flitter-ui/chart";
import type { ToastBarChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
