import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "../config";
import { cartesian } from "../../../_styles/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BulletChartCustom<AgBulletChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
