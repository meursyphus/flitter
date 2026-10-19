import type { Widget } from "flitterjs";
import type { BoxPlotChartCustom } from "@flitterjs/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({ tooltip, enabled: ctx.config.tooltip.enabled });
}
