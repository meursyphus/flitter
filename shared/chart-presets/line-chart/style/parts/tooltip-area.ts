import type { LineChartCustom } from "@flitterjs/chart";
import type { AgLineChartConfig } from "../config";
import { agLineLikeTooltipArea } from "../../../_shared/ag/line-like";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgLineChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
