import { SizedBox, type Widget } from "flitter-core";
import HeadlessLineChart from "@headless/line-chart";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
  LineChartGetPointValueFn as GetPointValueFn,
} from "@headless/line-chart/types";
import * as Cartesian from "@shared/cartesian/index";
import { DataView, Grid } from "../../../shared/line-like";
import { stackedGetScale } from "./stacked-get-scale";
import { stackedGetPointValue } from "./stacked-get-point-value";

export type {
  LineChartCustom,
  LineChartData,
  LineChartScale,
  LineChartScaleOptions,
  LineChartContext,
  GetScaleFn,
  GetScaleOptionsFn,
  LineChartGetPointValueFn as GetPointValueFn,
} from "@headless/line-chart/types";
export { LineChartController } from "@headless/line-chart/controller";

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
