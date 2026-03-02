import type { Widget } from "flitter-core";
import HeadlessBarChart from "@headless/bar-chart";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/bar-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { stackedBarGroup } from "./stacked-bar-group";
import { stackedGetScale } from "./stacked-get-scale";
import { BarBox } from "./bar-box";
import { Series } from "./series";
import { Grid } from "./grid";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
export { BarChartController } from "@headless/bar-chart/controller";

const baseDefaults: Partial<BarChartCustom> = {
  barGroup: stackedBarGroup,
  barBox: BarBox,
  series: Series,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

export function BaseStackedBarChart<TConfig = {}>({
  custom,
  getScale = stackedGetScale,
  ...rest
}: {
  custom: Partial<BarChartCustom<TConfig>>;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessBarChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as BarChartCustom<TConfig>,
  });
}
