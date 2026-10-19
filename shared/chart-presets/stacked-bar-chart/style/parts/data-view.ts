import type { Widget } from "flitterjs";
import type { BarChartCustom } from "@flitterjs/chart";
import type { AgStackedBarChartConfig } from "../config";
import { DataView } from "../../../_shared/ag/bar-like/index";
import { AgTooltipOverlay } from "../../../_shared/ag/bar-like";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgStackedBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
