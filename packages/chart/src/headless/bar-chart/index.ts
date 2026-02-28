import type { Widget } from "flitter-core";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./types";
import { BarChartProvider } from "./provider";

export default function BarChart<TConfig = {}>(props: {
  custom?: Partial<BarChartCustom<TConfig>>;
  title?: string;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return BarChartProvider(props);
}
