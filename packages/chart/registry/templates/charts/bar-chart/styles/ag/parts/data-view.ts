import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";
import { DataView } from "../../../../../shared/bar-like";
import { AgTooltipOverlay } from "@styles/ag";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
