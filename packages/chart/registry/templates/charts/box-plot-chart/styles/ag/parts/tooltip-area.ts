import type { Widget } from "flitter-core";
import type { BoxPlotChartCustom } from "@headless/box-plot-chart/types";
import type { AgBoxPlotChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({ tooltip, enabled: ctx.config.tooltip.enabled });
}
