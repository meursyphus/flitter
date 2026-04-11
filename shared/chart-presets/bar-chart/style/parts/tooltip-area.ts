import type { Widget } from "flitter-ui";
import type { BarChartCustom } from "flitter-ui/chart";
import type { AgBarChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BarChartCustom<AgBarChartConfig>['tooltipArea']>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
