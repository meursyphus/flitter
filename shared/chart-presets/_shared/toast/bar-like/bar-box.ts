import type { BarChartCustom } from "flitter-ui/chart";
import { EdgeInsets, FractionallySizedBox, Padding } from "flitter-ui";

export function BarBox(
  ...[{ bar, ratio, alignment }, { direction }]: Parameters<BarChartCustom['barBox']>
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
