import type { Widget } from "flitter-core";
import HeadlessBarChart from "../../_flitter/headless/bar-chart";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "../../_flitter/headless/bar-chart";
import * as Cartesian from "../../_flitter/shared/cartesian/index";
import { BarBox, DataView, Grid } from "../../ag-base/bar-like/index";
import { stackedBarGroup } from "./stacked-bar-group";
import { stackedGetScale } from "./stacked-get-scale";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, GetScaleFn, GetScaleOptionsFn } from "../../_flitter/headless/bar-chart";
export { BarChartController } from "../../_flitter/headless/bar-chart";

const baseDefaults: Partial<BarChartCustom> = {
  barGroup: stackedBarGroup,
  barBox: BarBox,
  dataView: DataView,
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
