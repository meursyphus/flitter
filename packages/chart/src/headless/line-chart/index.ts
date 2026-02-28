import type { Widget } from "flitter-core";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { LineChartProvider } from "./provider";

export default function LineChart<TConfig = {}>(props: {
  custom: LineChartCustom<TConfig>;
  title?: string;
  data: LineChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return LineChartProvider(props as any);
}
