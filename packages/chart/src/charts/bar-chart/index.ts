import type { Widget } from "flitter-core";
import { barChartStyles, type BarChartStyleMap } from "./plugin";
import type { BarChartCustom, BarChartData, BarChartScale } from "@headless/bar-chart/types";

export default function BarChart<S extends keyof BarChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<BarChartStyleMap[S]>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<BarChartStyleMap[S]>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: (data: BarChartData) => BarChartScale;
}): Widget {
  const factory = barChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
