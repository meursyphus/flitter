import type { LineChartCustom } from "@flitterjs/chart";
import type { ToastLineChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "../../../_shared/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastLineChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
