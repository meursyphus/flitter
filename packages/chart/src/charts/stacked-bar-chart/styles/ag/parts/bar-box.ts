import {
  FractionallySizedBox,
  EdgeInsets,
  Padding,
} from "flitter-core";
import type { BarChartCustom } from "@headless/bar-chart/types";
import type { AgStackedBarChartConfig } from "../config";

export function agBarBox(
  ...[{ bar, ratio, alignment }, { direction }]: Parameters<BarChartCustom<AgStackedBarChartConfig>['barBox']>
) {
  const isVertical = direction === "vertical";
  return FractionallySizedBox({
    alignment,
    widthFactor: isVertical ? undefined : ratio,
    heightFactor: isVertical ? ratio : undefined,
    child: Padding({
      padding: EdgeInsets.symmetric(
        isVertical ? { horizontal: 2 } : { vertical: 2 }
      ),
      child: bar,
    }),
  });
}
