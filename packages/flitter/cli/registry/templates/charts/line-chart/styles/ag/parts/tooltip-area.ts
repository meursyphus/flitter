import type { LineChartCustom } from "@headless/line-chart/types";
import type { AgLineChartConfig } from "../config";
import { agLineLikeTooltipArea } from "@styles/ag/line-like";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgLineChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
