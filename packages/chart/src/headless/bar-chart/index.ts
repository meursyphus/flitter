import type { Widget } from "flitter-core";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { BarChartProvider } from "./provider";

export default function BarChart<TConfig extends object = object>(props: {
  custom: BarChartCustom<TConfig>;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BarChartProvider(props);
}
