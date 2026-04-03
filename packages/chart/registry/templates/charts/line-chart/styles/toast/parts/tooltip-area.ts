import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastLineChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastLineChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
