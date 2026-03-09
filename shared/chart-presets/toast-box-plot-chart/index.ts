import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-ui/chart";
import { BaseBoxPlotChart } from "../box-plot-chart/base";
import type {
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "../box-plot-chart/base";
import { toastStyleConfig, type ToastBoxPlotChartConfig } from "./style";

export { type ToastBoxPlotChartConfig } from "./style";

export default function ToastBoxPlotChart({
  config,
  data,
  custom,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<ToastBoxPlotChartConfig>;
  data: BoxPlotChartData;
  custom?: Partial<BoxPlotChartCustom<ToastBoxPlotChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  direction?: BoxPlotChartDirection;
}): Widget {
  return BaseBoxPlotChart({
    data,
    config: toastStyleConfig.createConfig(config),
    custom: { ...toastStyleConfig.custom, ...custom },
    getScaleOptions: getScaleOptions ?? toastStyleConfig.getScaleOptions,
    direction,
    ...rest,
  });
}
