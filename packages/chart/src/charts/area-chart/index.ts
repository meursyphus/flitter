import type { Widget } from "flitter-core";
import { HeadlessLineChart } from "./headless";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./headless";
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
  return HeadlessLineChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
