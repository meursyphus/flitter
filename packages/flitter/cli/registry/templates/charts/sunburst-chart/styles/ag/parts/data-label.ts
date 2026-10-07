import type { SunburstChartCustom } from "@headless/sunburst-chart/types";
import type { SunburstChartConfig } from "../config";
import { DataLabel } from "../../../base/data-label";

export function agDataLabel(
  ...[args, ctx]: Parameters<
    SunburstChartCustom<SunburstChartConfig>["dataLabel"]
  >
) {
  return DataLabel(args, ctx);
}
