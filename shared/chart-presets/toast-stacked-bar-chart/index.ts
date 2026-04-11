import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseStackedBarChart } from "./base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastStackedBarChartConfig } from "./style";

export * from "./base";
export { type ToastStackedBarChartConfig } from "./style";

export default function ToastStackedBarChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<ToastStackedBarChartConfig>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<ToastStackedBarChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: "vertical" | "horizontal";
}): Widget {
  return BaseStackedBarChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
