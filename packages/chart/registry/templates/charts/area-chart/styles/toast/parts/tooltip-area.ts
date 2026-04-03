import type { LineChartCustom } from "@headless/line-chart/types";
import type { ToastAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "@styles/toast";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
