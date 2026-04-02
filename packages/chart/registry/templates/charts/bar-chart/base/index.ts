import { SizedBox, type Widget } from "flitter-core";
import HeadlessBarChart from "@headless/bar-chart";
import type {
  BarChartCustom,
  BarChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/bar-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { BarBox, DataView, Grid } from "../../../shared/bar-like";
import { BarGroup } from "./bar-group";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
export { BarChartController } from "@headless/bar-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<BarChartCustom> = {
  barGroup: BarGroup,
  barBox: BarBox,
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
  tooltip: () => SizedBox.shrink(),
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
