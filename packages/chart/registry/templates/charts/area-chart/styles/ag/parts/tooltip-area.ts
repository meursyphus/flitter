import type { LineChartCustom } from "@headless/line-chart/types";
import type { AgAreaChartConfig } from "../config";
import { agLineLikeTooltipArea } from "@styles/ag";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgAreaChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
