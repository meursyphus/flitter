import type { Widget } from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";
import type { AgStackedBarChartConfig } from "../config";
import { DataView } from "../../../_styles/ag/bar-like/index";
import { AgTooltipOverlay } from "../../../_styles/ag/index";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
