import type { Widget } from "flitter-core";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "../bar-chart/types";
import BarChart from "../bar-chart";
import * as StackedDefault from "./default";

/**
 * StackedBarChart is a thin wrapper around BarChart.
 * It overrides getScale and barGroup defaults to render stacked bars.
 */
export default function StackedBarChart<TConfig = {}>(props: {
  custom?: Partial<BarChartCustom<TConfig>>;
  title?: string;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  const {
    custom = {},
    getScale = StackedDefault.getScale as unknown as GetScaleFn,
    ...rest
  } = props;

  return BarChart({
    ...rest,
    getScale,
    custom: {
      barGroup: StackedDefault.BarGroup,
      ...custom,
    } as Partial<BarChartCustom<TConfig>>,
  });
}
