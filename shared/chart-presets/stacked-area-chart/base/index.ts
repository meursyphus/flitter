import { SizedBox, type Widget } from "flitter-core";
import { LineChart as HeadlessLineChart } from "flitter-ui/chart";
import type {
  LineChartCustom,
  LineChartData,
  LineChartGetScaleFn as GetScaleFn,
  LineChartGetScaleOptionsFn as GetScaleOptionsFn,
  GetPointValueFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { DataView, Grid } from "../../_styles/ag/line-like/index";
import { stackedGetScale } from "./stacked-get-scale";
import { stackedGetPointValue } from "./stacked-get-point-value";

export type { LineChartCustom, LineChartData, LineChartScale, LineChartScaleOptions, LineChartContext, LineChartGetScaleFn as GetScaleFn, LineChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
export { LineChartController } from "flitter-ui/chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<LineChartCustom> = {
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
  tooltip: () => SizedBox.shrink(),
  tooltipArea: () => SizedBox.shrink(),
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
  getPointValue?: GetPointValueFn;
  config?: TConfig;
}): Widget {
  return HeadlessLineChart({
    ...rest,
    getScale,
    getPointValue: rest.getPointValue ?? stackedGetPointValue,
    custom: { ...baseDefaults, ...custom } as LineChartCustom<TConfig>,
  });
}
