import type { Widget } from "flitter-core";
import { BaseBarChart } from "../../bar-chart/base";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
import { stackedBarGroup } from "./stacked-bar-group";
import { stackedGetScale } from "./stacked-get-scale";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, GetScaleFn, GetScaleOptionsFn } from "@headless/bar-chart/types";
export { BarChartController } from "@headless/bar-chart/controller";

export function BaseStackedBarChart<TConfig = {}>(props: {
  custom: Partial<BarChartCustom<TConfig>>;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  const {
    getScale = stackedGetScale,
    custom,
    ...rest
  } = props;

  return BaseBarChart<TConfig>({
    ...rest,
    getScale,
    custom: { barGroup: stackedBarGroup, ...custom },
  });
}
