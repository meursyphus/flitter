import type { LineChartCustom } from "flitter-ui/chart";
import type { AgStackedAreaChartConfig } from "../config";
import { agLineLikeTooltipArea } from "../../../_shared/ag/line-like";

export function agTooltipArea(
  ...args: Parameters<LineChartCustom<AgStackedAreaChartConfig>["tooltipArea"]>
) {
  return agLineLikeTooltipArea(...args);
}
