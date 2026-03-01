import type { Widget } from "flitter-core";
import { BaseStackedAreaChart } from "./base";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./base";
import {
  stackedAreaChartStyleConfigs,
  type StackedAreaChartStyleMap,
} from "./plugin";

export default function StackedAreaChart<
  S extends keyof StackedAreaChartStyleMap,
>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<StackedAreaChartStyleMap[S]>;
  data: StackedAreaChartData;
  custom?: Partial<StackedAreaChartCustom<StackedAreaChartStyleMap[S]>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = stackedAreaChartStyleConfigs[style];
  return BaseStackedAreaChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
