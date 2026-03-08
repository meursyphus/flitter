import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseScatterChart } from "./base";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { toastStyleConfig, type ToastScatterChartConfig } from "./style";

export * from "./base";
export { type ToastScatterChartConfig } from "./style";

export default function ToastScatterChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<ToastScatterChartConfig>;
  data: ScatterChartData;
  custom?: Partial<ScatterChartCustom<ToastScatterChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseScatterChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    ...rest,
  });
}
