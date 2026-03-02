import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";
import { Series } from "@shared/bar-like";
import { AgTooltipOverlay } from "@styles/ag";

export function agSeries(
  ...[args, context]: Parameters<BarChartCustom<AgBarChartConfig>["series"]>
): Widget {
  const child = Series(args, context);
  return AgTooltipOverlay({ child, context });
}
