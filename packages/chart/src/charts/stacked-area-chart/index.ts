import type { Widget } from "flitter-core";
import { BaseStackedAreaChart } from "./base";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
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
  ...rest
}: {
  style: S;
  config?: Partial<StackedAreaChartStyleMap[S]>;
  data: StackedAreaChartData;
  custom?: Partial<StackedAreaChartCustom>;
  title?: string;
  getScale?: (data: StackedAreaChartData) => StackedAreaChartScale;
}): Widget {
  const sc = stackedAreaChartStyleConfigs[style];
  const resolvedConfig = sc.createConfig(config);
  return BaseStackedAreaChart({
    data,
    custom: { ...sc.custom(resolvedConfig), ...custom },
    ...rest,
  });
}
