import type { Widget } from "flitter-core";
import { LineChart as HeadlessLineChart } from "flitter-ui/chart";
import type {
  LineChartCustom,
  LineChartData,
  LineChartGetScaleFn as GetScaleFn,
  LineChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { DataView, Grid } from "../../_styles/ag/line-like/index";

export type { LineChartCustom, LineChartData, LineChartScale, LineChartScaleOptions, LineChartContext, LineChartGetScaleFn as GetScaleFn, LineChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
export { LineChartController } from "flitter-ui/chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<LineChartCustom> = {
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) =>
  Cartesian.getScale({ datasets }, options);

export function BaseAreaChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
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
