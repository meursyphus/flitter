import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseBubbleChart } from "./base";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgBubbleChartConfig } from "./style";

export * from "./base";
export { type AgBubbleChartConfig } from "./style";

export default function AgBubbleChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<AgBubbleChartConfig>;
  data: BubbleChartData;
  custom?: Partial<BubbleChartCustom<AgBubbleChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseBubbleChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    ...rest,
  });
}
