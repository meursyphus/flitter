import type { Widget } from "flitter-core";
import type {
  LineChartCustom,
  LineChartData,
  GetScaleFn,
  GetScaleOptionsFn,
  GetPointValueFn,
} from "./types";
import { LineChartProvider } from "./provider";

export default function LineChart<TConfig extends object = object>(props: {
  custom: LineChartCustom<TConfig>;
  data: LineChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  getPointValue?: GetPointValueFn;
  config?: TConfig;
}): Widget {
  return LineChartProvider(props);
}
