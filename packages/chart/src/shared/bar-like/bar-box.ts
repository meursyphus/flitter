import type { BarChartCustom } from "@headless/bar-chart/types";
import { EdgeInsets, FractionallySizedBox, Padding } from "flitter-core";

export function BarBox(
  ...[{ bar, ratio, alignment }, { direction }]: Parameters<BarChartCustom["barBox"]> // label, legend, isHovered available but unused in default
) {
  const isVertical = direction === "vertical";
  return FractionallySizedBox({
    alignment,
    widthFactor: isVertical ? undefined : ratio,
    heightFactor: isVertical ? ratio : undefined,
    child: Padding({
      padding: EdgeInsets.symmetric(
        isVertical ? { horizontal: 2 } : { vertical: 2 },
      ),
      child: bar,
    }),
  });
}
