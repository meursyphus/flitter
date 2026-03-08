import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseBarChart } from "./base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastBarChartConfig } from "./style";

export * from "./base";
export { type ToastBarChartConfig } from "./style";

export default function ToastBarChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<ToastBarChartConfig>;
  data: BarChartData;
  custom?: Partial<BarChartCustom<ToastBarChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: "vertical" | "horizontal";
}): Widget {
  return BaseBarChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
