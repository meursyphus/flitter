import type { Widget } from "flitter-core";
import type { BulletChartCustom } from "@headless/bullet-chart/types";
import type { ToastBulletChartConfig } from "../config";
import { cartesian } from "@styles/toast";

export function toastTooltipArea(
  ...[{ tooltip, hoveredBullet }, ctx]: Parameters<BulletChartCustom<ToastBulletChartConfig>["tooltipArea"]>
): Widget {
  return cartesian.toastRectTooltipArea({
    tooltip,
    anchorRect: hoveredBullet,
    enabled: ctx.config.tooltip.enabled,
    mode: {
      variant: "bar",
      direction: ctx.direction,
      value: hoveredBullet?.value ?? 0,
    },
  });
}
