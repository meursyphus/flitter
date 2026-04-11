import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "@headless/bullet-chart/types";
import type { AgBulletChartConfig } from "../config";
import { cartesian } from "@styles/ag";

export function agTooltipArea(
  ...[{ tooltip }, ctx]: Parameters<BulletChartCustom<AgBulletChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.agMouseTooltipArea({
    tooltip,
    enabled: ctx.config.tooltip.enabled,
  });
}
