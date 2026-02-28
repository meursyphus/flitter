import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import { Stack, Positioned } from "flitter-core";

export function Series(
  ...[{ areas }]: Parameters<StackedAreaChartCustom["series"]>
) {
  return Stack({
    children: areas.map((area) =>
      Positioned.fill({
        child: area,
      }),
    ),
  });
}
