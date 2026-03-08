import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseScatterChart } from "./base";
import type { ScatterChartCustom, ScatterChartData, GetScaleFn, GetScaleOptionsFn } from "./base";
import { agStyleConfig, type AgScatterChartConfig } from "./style";

export * from "./base";
export { type AgScatterChartConfig } from "./style";

export default function AgScatterChart({
  config,
  data,
  custom,
  getScaleOptions,
  ...rest
}: {
  config?: DeepPartial<AgScatterChartConfig>;
  data: ScatterChartData;
  custom?: Partial<ScatterChartCustom<AgScatterChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return BaseScatterChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    ...rest,
  });
}
