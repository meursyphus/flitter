import type { Widget } from "flitter-core";
import type { ScatterChartCustom } from "@headless/scatter-chart/types";
import type { AgScatterChartConfig } from "../config";
import { Series } from "../../../base/series";
import { ScatterTooltipOverlay } from "./tooltip-overlay";

export function agSeries(
  ...[args, context]: Parameters<ScatterChartCustom<AgScatterChartConfig>["series"]>
): Widget {
  const child = Series(args, context);
  return ScatterTooltipOverlay({ child, config: context.config });
}
