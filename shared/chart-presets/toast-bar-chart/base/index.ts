import type { Widget } from "flitter-core";
import HeadlessBarChart from "../../_flitter/headless/bar-chart";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "../../_flitter/headless/bar-chart";
import * as Cartesian from "../../_flitter/shared/cartesian/index";
import { BarBox, DataView, Grid } from "../../toast-base/bar-like/index";
import { BarGroup } from "./bar-group";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, GetScaleFn, GetScaleOptionsFn } from "../../_flitter/headless/bar-chart";
export { BarChartController } from "../../_flitter/headless/bar-chart";

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
