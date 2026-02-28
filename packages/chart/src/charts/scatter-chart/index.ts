import type { Widget } from "flitter-core";
import { scatterChartStyles, type ScatterChartStyleMap } from "./plugin";
import type { ScatterChartCustom, ScatterChartData, ScatterChartScale } from "@headless/scatter-chart/types";

export default function ScatterChart<S extends keyof ScatterChartStyleMap>({
  style,
  config,
  data,
  custom,
  ...rest
}: {
  style: S;
  config?: Partial<ScatterChartStyleMap[S]>;
  data: ScatterChartData;
  custom?: Partial<ScatterChartCustom<ScatterChartStyleMap[S]>>;
  title?: string;
  getScale?: (data: ScatterChartData) => ScatterChartScale;
}): Widget {
  const factory = scatterChartStyles[style];
  return factory({ data, config, custom, ...rest } as any);
}
