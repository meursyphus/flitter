import {
  Stack,
  Positioned,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "@headless/line-chart/types";
import type { AgStackedAreaChartConfig } from "../config";

export function agDataView(
  ...[args, ctx]: Parameters<LineChartCustom<AgStackedAreaChartConfig>["dataView"]>
) {
  const { lines } = args;
  const datasets = ctx.data.datasets;

  const children: Widget[] = lines.map((line, i) =>
    Positioned({
      key: datasets[i]?.legend ?? i,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      child: line,
    }),
  );

  return Stack({ children });
}
