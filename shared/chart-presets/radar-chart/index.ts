import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseRadarChart } from "./base";
import type { RadarChartCustom, RadarChartData, GetScaleFn } from "./base";
import { agStyleConfig, type AgRadarChartConfig } from "./style";

export * from "./base";
export { type AgRadarChartConfig } from "./style";

export default function AgRadarChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<AgRadarChartConfig>;
  data: RadarChartData;
  custom?: Partial<RadarChartCustom<AgRadarChartConfig>>;
  getScale?: GetScaleFn;
}): Widget {
  return BaseRadarChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    ...rest,
  });
}
