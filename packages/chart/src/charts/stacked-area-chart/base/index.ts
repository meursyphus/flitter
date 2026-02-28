import type { Widget } from "flitter-core";
import HeadlessStackedAreaChart from "@headless/stacked-area-chart";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
} from "@headless/stacked-area-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { Series } from "./series";
import { Grid } from "./grid";

export type { StackedAreaChartCustom, StackedAreaChartData, StackedAreaChartScale, StackedAreaChartConfig } from "@headless/stacked-area-chart/types";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<StackedAreaChartCustom> = {
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale = ({ datasets }: Omit<StackedAreaChartData, "labels">): StackedAreaChartScale => {
  const pointCount = datasets[0]?.values.length ?? 0;
  const stackedTotals: number[] = new Array(pointCount).fill(0);

  for (const dataset of datasets) {
    dataset.values.forEach((value, i) => {
      stackedTotals[i] += value;
    });
  }

  return Cartesian.getScale({
    datasets: [{ legend: "", values: stackedTotals }],
  });
};

export function BaseStackedAreaChart({
  custom = {},
  getScale = defaultGetScale,
  ...rest
}: {
  custom?: Partial<StackedAreaChartCustom>;
  title?: string;
  data: StackedAreaChartData;
  getScale?: (data: StackedAreaChartData) => StackedAreaChartScale;
}): Widget {
  return HeadlessStackedAreaChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as StackedAreaChartCustom,
  });
}
