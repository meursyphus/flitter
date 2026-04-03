import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "../../../_styles/toast/index";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
