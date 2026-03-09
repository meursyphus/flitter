import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BasePieChart } from "./base";
import type { PieChartCustom, PieChartData } from "./base";
import { agStyleConfig, type AgPieChartConfig } from "./style";

export * from "./base";
export { type AgPieChartConfig } from "./style";

export default function AgPieChart({
  config,
  data,
  custom,
  ...rest
}: {
  config?: DeepPartial<AgPieChartConfig>;
  data: PieChartData;
  custom?: Partial<PieChartCustom<AgPieChartConfig>>;
}): Widget {
  return BasePieChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    ...rest,
  });
}
