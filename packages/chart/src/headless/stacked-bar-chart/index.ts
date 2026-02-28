import type { Widget } from "flitter-core";
import type { BarChartCustom, BarChartData, GetScaleFn, GetScaleOptionsFn } from "../bar-chart/types";
import { StackedBarChartProvider } from "./provider";
import * as StackedDefault from "./default";

/**
 * StackedBarChart uses its own provider with stacked layout logic.
 * It overrides getScale to compute stacked totals.
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
    getScale = StackedDefault.getScale as unknown as GetScaleFn,
    ...rest
  } = props;

  return StackedBarChartProvider({
    ...rest,
    getScale,
  });
}
