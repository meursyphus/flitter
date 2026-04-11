import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseRadarChart } from "./base";
import type { RadarChartCustom, RadarChartData, GetScaleFn } from "./base";
import { toastStyleConfig, type ToastRadarChartConfig } from "./style";

export * from "./base";
export { type ToastRadarChartConfig } from "./style";

export default function ToastRadarChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<ToastRadarChartConfig>;
  data: RadarChartData;
  custom?: Partial<RadarChartCustom<ToastRadarChartConfig>>;
  getScale?: GetScaleFn;
}): Widget {
  return BaseRadarChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    ...rest,
  });
}
