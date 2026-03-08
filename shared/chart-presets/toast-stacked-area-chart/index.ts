import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { BaseStackedAreaChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedAreaChartConfig } from "./styles/toast";

export * from "./base";
export { type ToastStackedAreaChartConfig } from "./styles/toast";

export default function ToastStackedAreaChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<ToastStackedAreaChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<ToastStackedAreaChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseStackedAreaChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    ...rest,
  });
}
