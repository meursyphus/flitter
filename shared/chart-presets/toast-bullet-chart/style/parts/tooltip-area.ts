import type { Widget } from "flitter-ui";
import type { BulletChartCustom } from "flitter-ui/chart";
import type { ToastBulletChartConfig } from "../config";
import { cartesian } from "../../../_shared/toast/index";

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
