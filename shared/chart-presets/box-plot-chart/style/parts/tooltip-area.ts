import type { Widget } from "flitter-ui";
import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({ tooltip, enabled: ctx.config.tooltip.enabled });
}
