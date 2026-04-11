import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "../../../_shared/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
