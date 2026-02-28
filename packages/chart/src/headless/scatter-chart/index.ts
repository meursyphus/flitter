import type { Widget } from "flitter-core";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { ScatterChartProvider } from "./provider";

export default function ScatterChart<TConfig = {}>(props: {
  custom: ScatterChartCustom<TConfig>;
  title?: string;
  data: ScatterChartData;
  getScale: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return ScatterChartProvider(props as any);
}
