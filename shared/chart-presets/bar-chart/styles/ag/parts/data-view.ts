import type { Widget } from "flitter-core";
import type { BarChartCustom } from "flitter-ui/chart";
import type { AgBarChartConfig } from "../config";
import { DataView } from "../../../../ag-base/bar-like/index";
import { AgTooltipOverlay } from "../../../../ag-base/index";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgBarChartConfig>["dataView"]>
): Widget {
  const child = DataView(args, context);
  return AgTooltipOverlay({ child, context });
}
