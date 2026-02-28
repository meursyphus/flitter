import type { Widget } from "flitter-core";
import { stackedBarChartStyles, type StackedBarChartStyleMap } from "./plugin";
import type { BarChartCustom, BarChartData, BarChartScale } from "@headless/bar-chart/types";

export default function StackedBarChart<S extends keyof StackedBarChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<StackedBarChartStyleMap[S]>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<StackedBarChartStyleMap[S]>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: (data: BarChartData) => BarChartScale;
}): Widget {
  const factory = stackedBarChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
