import {
  SizedBox,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastLineChartConfig } from "../config";
import { cartesian } from "../../../_styles/toast/index";

export function toastTooltipArea(
  ...[args, ctx]: Parameters<LineChartCustom<ToastLineChartConfig>["tooltipArea"]>
) {
  const { tooltip, hoveredPoint } = args;
  if (hoveredPoint == null || tooltip == null || !ctx.config.tooltip.enabled) {
    return SizedBox.shrink();
  }

  const legendIdx = ctx.legends.indexOf(hoveredPoint.legend);
  const color = ctx.config.colors[legendIdx % ctx.config.colors.length];

  return cartesian.toastPointTooltipArea({
    tooltip,
    anchorPoint: { x: hoveredPoint.x, y: hoveredPoint.y },
    enabled: true,
    dotColor: color,
  });
}
