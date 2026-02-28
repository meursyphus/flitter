import type { Widget } from "flitter-core";
import { HeadlessBarChart } from "../bar-chart/headless";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "../bar-chart/headless";
import { stackedBarGroup } from "./stacked-bar-group";
import { stackedGetScale } from "./stacked-get-scale";

export function HeadlessStackedBarChart<TConfig = {}>(props: {
  custom?: Partial<BarChartCustom<TConfig>>;
  title?: string;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  const {
    getScale = stackedGetScale as unknown as GetScaleFn,
    custom,
    ...rest
  } = props;

  return HeadlessBarChart<TConfig>({
    ...rest,
    getScale,
    custom: { barGroup: stackedBarGroup as any, ...custom },
  });
}
