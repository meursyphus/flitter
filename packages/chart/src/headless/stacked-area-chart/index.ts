import type { Widget } from "flitter-core";
import type { StackedAreaChartCustom, StackedAreaChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { StackedAreaChartProvider } from "./provider";

export default function StackedAreaChart<TConfig = {}>(props: {
  custom: StackedAreaChartCustom<TConfig>;
  title?: string;
  data: StackedAreaChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return StackedAreaChartProvider(props as any);
}
