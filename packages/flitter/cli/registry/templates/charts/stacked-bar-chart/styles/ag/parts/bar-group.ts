import type { Widget } from "flitterjs";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgStackedBarChartConfig } from "../config";
import { stackedBarGroup } from "../../../base/stacked-bar-group";

export function agBarGroup(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["barGroup"]>
): Widget {
  return stackedBarGroup(args, context);
}
