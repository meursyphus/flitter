import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
