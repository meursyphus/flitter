import type { Widget } from "flitter-core";
import HeadlessStackedAreaChart from "@headless/stacked-area-chart";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/stacked-area-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { Series } from "./series";
import { Grid } from "./grid";

export type { StackedAreaChartCustom, StackedAreaChartData, StackedAreaChartScale, StackedAreaChartScaleOptions, StackedAreaChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/stacked-area-chart/types";
export { StackedAreaChartController } from "@headless/stacked-area-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<StackedAreaChartCustom> = {
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) => {
  const pointCount = datasets[0]?.values.length ?? 0;
  const stackedTotals: number[] = new Array(pointCount).fill(0);

  for (const dataset of datasets) {
    dataset.values.forEach((value, i) => {
      stackedTotals[i] += value;
    });
  }

  return Cartesian.getScale(
    { datasets: [{ legend: "", values: stackedTotals }] },
    options,
  );
};

export function BaseStackedAreaChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
  ...rest
}: {
  custom: Partial<StackedAreaChartCustom<TConfig>>;
  data: StackedAreaChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessStackedAreaChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as StackedAreaChartCustom<TConfig>,
  });
}
