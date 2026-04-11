import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseLineChart } from "./base";
import type { LineChartCustom, LineChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastLineChartConfig } from "./style";

export * from "./base";
export { type ToastLineChartConfig } from "./style";

export default function ToastLineChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<ToastLineChartConfig>;
  data: LineChartData;
  custom?: Partial<LineChartCustom<ToastLineChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseLineChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    ...rest,
  });
}
