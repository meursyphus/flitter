import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseStackedAreaChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgStackedAreaChartConfig } from "./styles/ag";

export * from "./base";
export { type AgStackedAreaChartConfig } from "./styles/ag";

export default function AgStackedAreaChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<AgStackedAreaChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<AgStackedAreaChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseStackedAreaChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    ...rest,
  });
}
