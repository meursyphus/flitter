import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BarChartCustom<AgBarChartConfig>['tooltipArea']>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
