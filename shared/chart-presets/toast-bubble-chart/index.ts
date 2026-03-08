import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { BaseBubbleChart } from "./base";
import type { BubbleChartCustom, BubbleChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBubbleChartConfig } from "./styles/toast";

export * from "./base";
export { type ToastBubbleChartConfig } from "./styles/toast";

export default function ToastBubbleChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<ToastBubbleChartConfig>;
  data: BubbleChartData;
  custom?: Partial<BubbleChartCustom<ToastBubbleChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseBubbleChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    ...rest,
  });
}
