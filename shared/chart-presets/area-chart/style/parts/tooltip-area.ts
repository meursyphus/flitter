import type { LineChartCustom } from "flitter-ui/chart";
import type { AgAreaChartConfig } from "../config";
import { agLineLikeTooltipArea } from "../../../_styles/ag/index";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgAreaChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
