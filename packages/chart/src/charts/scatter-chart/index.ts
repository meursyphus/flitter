import type { Widget } from "flitter-core";
import { HeadlessScatterChart } from "./headless";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "./headless";
import { scatterChartStyleConfigs, type ScatterChartStyleMap } from "./plugin";

export default function ScatterChart<S extends keyof ScatterChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<ScatterChartStyleMap[S]>;
  data: ScatterChartData;
  custom?: Partial<ScatterChartCustom<ScatterChartStyleMap[S]>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = scatterChartStyleConfigs[style];
  return HeadlessScatterChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
