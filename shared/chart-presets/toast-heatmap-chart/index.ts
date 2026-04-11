import type { Widget } from "flitter-ui";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseHeatmapChart } from "./base";
import type { HeatmapCustom, HeatmapData } from "./base";
import { toastStyleConfig, type ToastHeatmapChartConfig } from "./style";

export * from "./base";
export { type ToastHeatmapChartConfig } from "./style";

export default function ToastHeatmapChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<ToastHeatmapChartConfig>;
  data: HeatmapData;
  custom?: Partial<HeatmapCustom<ToastHeatmapChartConfig>>;
}): Widget {
  return BaseHeatmapChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    ...rest,
  });
}
