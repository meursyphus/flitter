import type { LineChartCustom } from "flitter-ui/chart";
import type { ToastStackedAreaChartConfig } from "../config";
import { toastLineLikeTooltipArea } from "../../../_shared/toast/line-like/tooltip-area";

export function toastTooltipArea(
  ...args: Parameters<LineChartCustom<ToastStackedAreaChartConfig>["tooltipArea"]>
) {
  return toastLineLikeTooltipArea(...args);
}
