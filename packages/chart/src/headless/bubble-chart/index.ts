import type { Widget } from "flitter-core";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { BubbleChartProvider } from "./provider";

export default function BubbleChart<TConfig extends object = object>(props: {
  custom: BubbleChartCustom<TConfig>;
  data: BubbleChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BubbleChartProvider(props);
}
