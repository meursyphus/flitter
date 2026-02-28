import type { Widget } from "flitter-core";
import { BaseStackedBarChart } from "./base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
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
  return BaseStackedBarChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
