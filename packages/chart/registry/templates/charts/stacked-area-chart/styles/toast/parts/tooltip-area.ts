import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
