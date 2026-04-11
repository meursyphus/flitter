import { SizedBox, type Widget } from "flitter-ui";
import { BarChart as HeadlessBarChart } from "flitter-ui/chart";
import type {
  BarChartCustom,
  BarChartData,
  BarChartGetScaleFn as GetScaleFn,
  BarChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { BarBox, DataView, Grid } from "../../_shared/toast/bar-like/index";
import { stackedBarGroup } from "./stacked-bar-group";
import { stackedGetScale } from "./stacked-get-scale";

export type { BarChartCustom, BarChartData, BarChartScale, BarChartDirection, BarChartScaleOptions, BarChartContext, BarChartGetScaleFn as GetScaleFn, BarChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
export { BarChartController } from "flitter-ui/chart";

const baseDefaults: Partial<BarChartCustom> = {
  barGroup: stackedBarGroup,
  barBox: BarBox,
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
  tooltip: () => SizedBox.shrink(),
  tooltipArea: () => SizedBox.shrink(),
};

export function BaseStackedBarChart<TConfig extends object = object>({
  custom,
  getScale = stackedGetScale,
  ...rest
}: {
  custom: Partial<BarChartCustom<TConfig>>;
  data: BarChartData;
  direction?: "vertical" | "horizontal";
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessBarChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as BarChartCustom<TConfig>,
  });
}
