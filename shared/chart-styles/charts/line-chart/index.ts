import type { Widget } from "flitter-core";
import { BaseLineChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import type { DeepPartial } from "@utils/index";
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
  config?: DeepPartial<LineChartStyleMap[S]>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<LineChartStyleMap[S]>>;
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
