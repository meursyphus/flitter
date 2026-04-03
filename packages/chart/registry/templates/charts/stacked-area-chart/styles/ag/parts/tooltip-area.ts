import type { LineChartCustom } from "@headless/line-chart/types";
import type { AgStackedAreaChartConfig } from "../config";
import { agLineLikeTooltipArea } from "@styles/ag";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgStackedAreaChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
