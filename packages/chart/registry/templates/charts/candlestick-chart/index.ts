import type { Widget } from "flitter-core";
import HeadlessCandlestickChart from "@headless/candlestick-chart";
import type {
  CandlestickChartCustom,
  CandlestickChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";

export type {
  CandlestickChartContext,
  CandlestickChartCustom,
  CandlestickChartDataPoint,
  CandlestickChartData,
  CandlestickChartScale,
  CandlestickChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { CandlestickChartController } from "./types";

const baseDefaults: Partial<CandlestickChartCustom> = {
  candlestick: Base.Candlestick,
  xAxis: Base.XAxis,
  xAxisLabel: Base.XAxisLabel,
  xAxisTick: Base.XAxisTick,
  yAxis: Base.YAxis,
  yAxisLabel: Base.YAxisLabel,
  yAxisTick: Base.YAxisTick,
  dataView: Base.DataView,
  layout: Base.Layout,
  plot: Base.Plot,
  legend: Base.Legend,
  title: Base.Title,
  dataLabel: Base.DataLabel,
  xAxisLine: Base.XAxisLine,
  yAxisLine: Base.YAxisLine,
  grid: Base.Grid,
  gridXLine: Base.GridXLine,
  gridYLine: Base.GridYLine,
  axisCorner: Base.AxisCorner,
};

export default function CandlestickChart<TConfig = {}>({
  custom,
  getScale = Base.getScale,
  ...rest
}: {
  custom?: Partial<CandlestickChartCustom<TConfig>>;
  data: CandlestickChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessCandlestickChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as CandlestickChartCustom<TConfig>,
  });
}
