import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { BaseLineChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgLineChartConfig } from "./styles/ag";

export * from "./base";
export { type AgLineChartConfig } from "./styles/ag";

export default function AgLineChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<AgLineChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<AgLineChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseLineChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    ...rest,
  });
}
