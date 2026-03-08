import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { BaseStackedBarChart } from "./base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgStackedBarChartConfig } from "./styles/ag";

export * from "./base";
export { type AgStackedBarChartConfig } from "./styles/ag";

export default function AgStackedBarChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<AgStackedBarChartConfig>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<AgStackedBarChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: "vertical" | "horizontal";
}): Widget {
  return BaseStackedBarChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
