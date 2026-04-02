import type { Widget } from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgBarChartConfig } from "../config";
import { DataView } from "../../../../../shared/bar-like";

export function agDataView(
  ...[args, context]: Parameters<BarChartCustom<AgBarChartConfig>["dataView"]>
): Widget {
  return DataView(args, context);
}
