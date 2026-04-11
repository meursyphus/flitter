import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseAreaChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgAreaChartConfig } from "./style";

export * from "./base";
export { type AgAreaChartConfig } from "./style";

export default function AgAreaChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<AgAreaChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<AgAreaChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseAreaChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    ...rest,
  });
}
