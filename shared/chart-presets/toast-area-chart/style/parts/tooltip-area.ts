import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "../../../_styles/toast/index";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
