import type { Widget } from "flitter-ui";
import type { BarChartCustom } from "flitter-ui/chart";
import type { AgStackedBarChartConfig } from "../config";
import { stackedBarGroup } from "../../base/stacked-bar-group";

export function agBarGroup(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["barGroup"]>
): Widget {
  return stackedBarGroup(args, context);
}
