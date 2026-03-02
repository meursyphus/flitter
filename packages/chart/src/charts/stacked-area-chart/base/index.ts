import type { Widget } from "flitter-core";
import HeadlessLineChart from "@headless/line-chart";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/line-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { Series } from "./series";
import { Grid } from "./grid";
import { stackedGetScale } from "./stacked-get-scale";

export type { LineChartCustom, LineChartData, LineChartScale, LineChartScaleOptions, LineChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/line-chart/types";
export { LineChartController } from "@headless/line-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<LineChartCustom> = {
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

export function BaseStackedAreaChart<TConfig = {}>({
  custom,
  getScale = stackedGetScale,
  ...rest
}: {
  custom: Partial<LineChartCustom<TConfig>>;
  data: LineChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessLineChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as LineChartCustom<TConfig>,
  });
}
