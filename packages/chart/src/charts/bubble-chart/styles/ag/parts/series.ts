import type { Widget } from "flitter-core";
import type { BubbleChartCustom } from "@headless/bubble-chart/types";
import type { AgBubbleChartConfig } from "../config";
import { Series } from "../../../base/series";
import { BubbleTooltipOverlay } from "./tooltip-overlay";

export function agSeries(
  ...[args, context]: Parameters<BubbleChartCustom<AgBubbleChartConfig>["series"]>
): Widget {
  const child = Series(args, context);
  return BubbleTooltipOverlay({ child, config: context.config });
}
