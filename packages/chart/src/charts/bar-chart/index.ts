import type { Widget } from "flitter-core";
import { BaseBarChart } from "./base";
import type { BarChartCustom, BarChartData, BarChartScale, GetScaleFn, GetScaleOptionsFn } from "./base";
import { barChartStyleConfigs, type BarChartStyleMap } from "./plugin";

export default function BarChart<S extends keyof BarChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<BarChartStyleMap[S]>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<BarChartStyleMap[S]>>;
  title?: string;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = barChartStyleConfigs[style];
  const direction = rest.direction ?? "vertical";
  return BaseBarChart({
    data,
    config: sc.createConfig(config, direction),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
