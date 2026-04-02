import {
  AnimatedFractionallySizedBox,
  EdgeInsets,
  Padding,
} from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";
import type { ToastBarChartConfig } from "../config";

export function toastBarBox(
  ...[{ bar, ratio, alignment, value, label, legend, isHovered }, ctx]: Parameters<BarChartCustom<ToastBarChartConfig>['barBox']>
) {
  const { direction, config } = ctx;
  const isVertical = direction === "vertical";

  return AnimatedFractionallySizedBox({
    duration: config.animation.duration,
    alignment,
    widthFactor: isVertical ? undefined : ratio,
    heightFactor: isVertical ? ratio : undefined,
    child: Padding({
      padding: EdgeInsets.symmetric(
        isVertical ? { horizontal: 2 } : { vertical: 2 }
      ),
      child: bar,
    }),
  });
}
