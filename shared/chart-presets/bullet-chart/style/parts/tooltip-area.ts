import type { Widget } from "flitterjs";
import type { BulletChartCustom } from "@flitterjs/chart";
import type { AgBulletChartConfig } from "../config";
import { cartesian } from "../../../_shared/ag/index";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BulletChartCustom<AgBulletChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
