import type { Widget } from "flitter-core";
import { BaseAreaChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { areaChartStyleConfigs, type AreaChartStyleMap } from "./plugin";

export default function AreaChart<S extends keyof AreaChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<AreaChartStyleMap[S]>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<AreaChartStyleMap[S]>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = areaChartStyleConfigs[style];
  return BaseAreaChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
