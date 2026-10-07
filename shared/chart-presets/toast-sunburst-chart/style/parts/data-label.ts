import type { SunburstChartCustom } from "flitter-ui/chart";
import type { SunburstChartConfig } from "../config";
import { DataLabel } from "../../base/data-label";

export function toastDataLabel(
  ...[args, ctx]: Parameters<
    SunburstChartCustom<SunburstChartConfig>["dataLabel"]
  >
) {
  return DataLabel(args, ctx);
}
