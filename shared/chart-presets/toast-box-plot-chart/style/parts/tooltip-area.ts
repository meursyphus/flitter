import type { Widget } from "flitter-core";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "../config";
import { cartesian } from "../../../_styles/toast/index";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBoxPlot }, ctx]: Parameters<BoxPlotChartCustom<ToastBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hoveredBoxPlot,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "boxPlot",
      direction: ctx.direction,
      kind: hoveredBoxPlot?.kind ?? "boxPlot",
    },
  });
}
