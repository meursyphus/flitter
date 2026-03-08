import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { BaseBarChart } from "./base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgBarChartConfig } from "./styles/ag";

export * from "./base";
export { type AgBarChartConfig } from "./styles/ag";

export default function AgBarChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<AgBarChartConfig>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<AgBarChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: "vertical" | "horizontal";
}): Widget {
  return BaseBarChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
