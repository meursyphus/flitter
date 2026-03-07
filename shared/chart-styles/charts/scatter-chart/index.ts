import type { Widget } from "flitter-core";
import { BaseScatterChart } from "./base";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import type { DeepPartial } from "@utils/index";
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
  config?: DeepPartial<ScatterChartStyleMap[S]>;
  data: ScatterChartData;
  custom?: Partial<ScatterChartCustom<ScatterChartStyleMap[S]>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = scatterChartStyleConfigs[style];
  return BaseScatterChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
