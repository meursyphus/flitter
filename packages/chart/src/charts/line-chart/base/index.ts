import type { Widget } from "flitter-core";
import HeadlessLineChart from "@headless/line-chart";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "@headless/line-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { DataView, Grid } from "@shared/line-like";

export type { LineChartCustom, LineChartData, LineChartScale, LineChartScaleOptions, LineChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/line-chart/types";
export { LineChartController } from "@headless/line-chart/controller";

/** Structural (non-visual) defaults provided by base */
const baseDefaults: Partial<LineChartCustom> = {
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const defaultGetScale: GetScaleFn = ({ datasets }, options) =>
  Cartesian.getScale({ datasets }, options);

export function BaseLineChart<TConfig = {}>({
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
