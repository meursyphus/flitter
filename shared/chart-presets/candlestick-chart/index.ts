import type { Widget } from "flitter-ui";
import { CandlestickChart as HeadlessCandlestickChart } from "flitter-ui/chart";
import type {
  CandlestickChartCustom,
  CandlestickChartData,
  CandlestickChartTransform,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";
import { styleConfig, type CandlestickChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  CandlestickChartContext,
  CandlestickChartRow,
  CandlestickChartData,
  CandlestickChartCandle,
  CandlestickChartTick,
  CandlestickChartGeometry,
  CandlestickChartGrouping,
  CandlestickChartTransform,
  CandlestickChartXValue,
  CandlestickChartXValueType,
  CandlestickChartScale,
  CandlestickChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { CandlestickChartController } from "./types";
export { type CandlestickChartConfig } from "./style";

const baseDefaults: Partial<CandlestickChartCustom> = {
  candlestickBox: Base.CandlestickBox,
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
  xAxisLine: Base.XAxisLine,
  yAxisLine: Base.YAxisLine,
  grid: Base.Grid,
  gridXLine: Base.GridXLine,
  gridYLine: Base.GridYLine,
  axisCorner: Base.AxisCorner,
};

export default function CandlestickChart({
  data,
  transform = {},
  config,
  custom,
  getScale = Base.getScale,
  getScaleOptions,
}: {
  custom?: Partial<CandlestickChartCustom<CandlestickChartConfig>>;
  data: CandlestickChartData;
  transform?: CandlestickChartTransform;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: DeepPartial<CandlestickChartConfig>;
}): Widget {
  return HeadlessCandlestickChart({
    data,
    transform,
    config: styleConfig.createConfig(config),
    getScale,
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as CandlestickChartCustom<CandlestickChartConfig>,
  });
}
