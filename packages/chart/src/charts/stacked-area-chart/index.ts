import type { Widget } from "flitter-core";
import {
  stackedAreaChartStyles,
  type StackedAreaChartStyleMap,
} from "./plugin";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
} from "@headless/stacked-area-chart/types";

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
  const factory = stackedAreaChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
