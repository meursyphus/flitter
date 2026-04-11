import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
