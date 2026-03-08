import type { Widget } from "flitter-core";
import HeadlessLineChart from "../../_flitter/headless/line-chart";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "../../_flitter/headless/line-chart";
import * as Cartesian from "../../_flitter/shared/cartesian/index";
import { DataView, Grid } from "../../toast-base/line-like/index";
import { stackedGetScale } from "./stacked-get-scale";

export type { LineChartCustom, LineChartData, LineChartScale, LineChartScaleOptions, LineChartContext, GetScaleFn, GetScaleOptionsFn } from "../../_flitter/headless/line-chart";
export { LineChartController } from "../../_flitter/headless/line-chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<LineChartCustom> = {
  dataView: DataView,
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
