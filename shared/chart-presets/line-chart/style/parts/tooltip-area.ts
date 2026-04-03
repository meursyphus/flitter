import type { LineChartCustom } from "flitter-ui/chart";
import type { AgLineChartConfig } from "../config";
import { agLineLikeTooltipArea } from "../../../_styles/ag/index";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgLineChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
