import type { Widget } from "flitter-core";
import type { BarChartCustom } from "../../../../_flitter/headless/bar-chart";
import type { AgStackedBarChartConfig } from "../config";
import { DataView } from "../../../../ag-base/bar-like/index";
import { AgTooltipOverlay } from "../../../../ag-base/index";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
