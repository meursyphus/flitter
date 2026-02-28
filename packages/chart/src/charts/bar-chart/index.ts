import type { Widget } from "flitter-core";
import { HeadlessBarChart } from "./headless";
import type { BarChartCustom, BarChartData, BarChartScale, GetScaleFn, GetScaleOptionsFn } from "./headless";
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
  return HeadlessBarChart({
    data,
    config: { ...sc.defaults, ...config },
    custom: { ...sc.custom, ...custom } as any,
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
