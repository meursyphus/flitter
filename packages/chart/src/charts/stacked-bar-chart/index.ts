import type { Widget } from "flitter-core";
import { HeadlessStackedBarChart } from "./headless";
import type { BarChartCustom, BarChartData, BarChartScale, GetScaleFn, GetScaleOptionsFn } from "../bar-chart/headless";
import { stackedBarChartStyleConfigs, type StackedBarChartStyleMap } from "./plugin";

export default function StackedBarChart<S extends keyof StackedBarChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<StackedBarChartStyleMap[S]>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<StackedBarChartStyleMap[S]>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = stackedBarChartStyleConfigs[style];
  return HeadlessStackedBarChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
