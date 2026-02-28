import type { Widget } from "flitter-core";
import { BaseLineChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { lineChartStyleConfigs, type LineChartStyleMap } from "./plugin";

export default function LineChart<S extends keyof LineChartStyleMap>({
  style,
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  style: S;
  config?: Partial<LineChartStyleMap[S]>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<LineChartStyleMap[S]>>;
  title?: string;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  const sc = lineChartStyleConfigs[style];
  return BaseLineChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
