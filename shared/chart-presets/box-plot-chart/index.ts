import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseBoxPlotChart } from "./base";
import type {
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./base";
import { agStyleConfig, type AgBoxPlotChartConfig } from "./style";

export * from "./base";
export { type AgBoxPlotChartConfig } from "./style";

export default function BoxPlotChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<AgBoxPlotChartConfig>;
  data: BoxPlotChartData;
  custom?: Partial<BoxPlotChartCustom<AgBoxPlotChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: BoxPlotChartDirection;
}): Widget {
  return BaseBoxPlotChart({
    data,
    config: agStyleConfig.createConfig(config),
    custom: { ...agStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? agStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
