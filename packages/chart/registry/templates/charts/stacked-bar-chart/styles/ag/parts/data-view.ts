import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgStackedBarChartConfig } from "../config";
import { DataView } from "../../../../../shared/bar-like";
import { AgTooltipOverlay } from "@styles/ag/bar-like";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
