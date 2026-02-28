import type { Widget } from "flitter-core";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { BubbleChartProvider } from "./provider";

export default function BubbleChart<TConfig = {}>(props: {
  custom: BubbleChartCustom<TConfig>;
  title?: string;
  data: BubbleChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BubbleChartProvider(props as any);
}
