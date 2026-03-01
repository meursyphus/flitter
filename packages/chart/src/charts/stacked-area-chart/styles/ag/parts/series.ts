import {
  Stack,
  Positioned,
  type Widget,
} from "flitter-core";
import type { StackedAreaChartCustom } from "@headless/stacked-area-chart/types";
import type { AgStackedAreaChartConfig } from "../config";

export function agSeries(
  ...[args, ctx]: Parameters<StackedAreaChartCustom<AgStackedAreaChartConfig>["series"]>
) {
  const { areas } = args;
  const datasets = ctx.data.datasets;

  const children: Widget[] = areas.map((area, i) =>
    Positioned({
      key: datasets[i]?.legend ?? i,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      child: area,
    }),
  );

  return Stack({ children });
}
