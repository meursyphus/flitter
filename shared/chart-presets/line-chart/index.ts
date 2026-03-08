import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseLineChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgLineChartConfig } from "./style";

export * from "./base";
export { type AgLineChartConfig } from "./style";

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
