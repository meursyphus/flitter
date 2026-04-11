import type { LineChartCustom } from "flitter-ui/chart";
import type { AgAreaChartConfig } from "../config";
import { agLineLikeTooltipArea } from "../../../_shared/ag/line-like";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgAreaChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
