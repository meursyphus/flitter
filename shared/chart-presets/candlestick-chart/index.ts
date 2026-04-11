import type { Widget } from "flitter-ui";
import { CandlestickChart as HeadlessCandlestickChart } from "flitter-ui/chart";
import type {
  CandlestickChartCustom,
  CandlestickChartData,
  CandlestickChartTransform,
  GetScaleFn,
  GetScaleOptionsFn,
  GetTicksFn,
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
  GetTicksFn,
} from "./types";
export { CandlestickChartController } from "./types";
export { type CandlestickChartConfig } from "./style";

const baseDefaults: Partial<CandlestickChartCustom> = {
  candlestickBox: Base.CandlestickBox,
  candlestick: Base.Candlestick,
  xAxis: Base.XAxis,
  yAxis: Base.YAxis,
  dataView: Base.DataView,
  plot: Base.Plot,
  grid: Base.Grid,
};

export default function CandlestickChart({
  data,
  transform = {},
  config,
  custom,
  getScale = Base.getScale,
  getScaleOptions,
  getTicks,
}: {
  custom?: Partial<CandlestickChartCustom<CandlestickChartConfig>>;
  data: CandlestickChartData;
  transform?: CandlestickChartTransform;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  getTicks?: GetTicksFn;
  config?: DeepPartial<CandlestickChartConfig>;
}): Widget {
  return HeadlessCandlestickChart({
    data,
    transform,
    config: styleConfig.createConfig(config),
    getScale,
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    getTicks,
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as CandlestickChartCustom<CandlestickChartConfig>,
  });
}
