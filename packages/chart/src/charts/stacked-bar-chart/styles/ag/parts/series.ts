import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgStackedBarChartConfig } from "../config";
import { Series } from "../../../base/series";
import { AgTooltipOverlay } from "@shared/styles/ag";

export function agSeries(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["series"]>
): Widget {
  const child = Series(args, context);
  return AgTooltipOverlay({ child, context });
}
