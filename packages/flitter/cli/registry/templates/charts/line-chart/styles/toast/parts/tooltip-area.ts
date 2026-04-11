import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastLineChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
