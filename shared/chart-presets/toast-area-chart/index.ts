import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseAreaChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastAreaChartConfig } from "./style";

export * from "./base";
export { type ToastAreaChartConfig } from "./style";

export default function ToastAreaChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<ToastAreaChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<ToastAreaChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseAreaChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    ...rest,
  });
}
