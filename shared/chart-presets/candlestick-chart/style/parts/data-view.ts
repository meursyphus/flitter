import { type Widget } from "flitter-core";
import type { CandlestickChartCustom } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "../config";
import { DataView } from "../../base/data-view";

export function agDataView(
  ...[args, context]: Parameters<CandlestickChartCustom<CandlestickChartConfig>["dataView"]>
): Widget {
  return DataView(args, context);
}
