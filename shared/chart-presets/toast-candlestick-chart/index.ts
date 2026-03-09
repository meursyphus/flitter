import type { Widget } from "flitter-core";
import { CandlestickChart as HeadlessCandlestickChart } from "flitter-ui/chart";
import type {
  CandlestickChartCustom,
  CandlestickChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";
import { styleConfig, type CandlestickChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

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
export { type CandlestickChartConfig } from "./style";

export default function CandlestickChart({
  data,
  config,
  custom,
  getScale = Base.getScale,
}: {
  custom?: Partial<CandlestickChartCustom<CandlestickChartConfig>>;
  data: CandlestickChartData;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: DeepPartial<CandlestickChartConfig>;
}): Widget {
  return HeadlessCandlestickChart({
    data,
    config: styleConfig.createConfig(config),
    getScale,
    custom: { ...styleConfig.custom, ...custom } as CandlestickChartCustom<CandlestickChartConfig>,
  });
}
