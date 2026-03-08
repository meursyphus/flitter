import type { Widget } from "flitter-core";
import { BarChart as HeadlessBarChart } from "flitter-ui/chart";
import type {
  BarChartCustom,
  BarChartData,
  BarChartGetScaleFn as GetScaleFn,
  BarChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { BarBox, DataView, Grid } from "../../_styles/ag/bar-like/index";
import { BarGroup } from "./bar-group";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, BarChartGetScaleFn as GetScaleFn, BarChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
export { BarChartController } from "flitter-ui/chart";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<BarChartCustom> = {
  barGroup: BarGroup,
  barBox: BarBox,
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) =>
  Cartesian.getScale({ datasets }, options);

export function BaseBarChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
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
