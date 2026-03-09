import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseHeatmapChart } from "./base";
import type { HeatmapCustom, HeatmapData } from "./base";
import { agStyleConfig, type AgHeatmapChartConfig } from "./style";

export * from "./base";
export { type AgHeatmapChartConfig } from "./style";

export default function AgHeatmapChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<AgHeatmapChartConfig>;
  data: HeatmapData;
  custom?: Partial<HeatmapCustom<AgHeatmapChartConfig>>;
}): Widget {
  return BaseHeatmapChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    ...rest,
  });
}
