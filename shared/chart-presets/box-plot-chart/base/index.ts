import type { Widget } from "flitter-core";
import { BoxPlotChart as HeadlessBoxPlotChart } from "flitter-ui/chart";
import type {
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartDirection,
  BoxPlotChartGetScaleFn as GetScaleFn,
  BoxPlotChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { BoxPlotGroup } from "./boxplot-group";
import { DataView } from "./data-view";
import { Grid } from "./grid";
import { getScale as defaultGetScale } from "./getScale";

export type {
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartScale,
  BoxPlotChartDirection,
  BoxPlotChartScaleOptions,
  BoxPlotChartContext,
  BoxPlotDataPoint,
  BoxPlotChartGetScaleFn as GetScaleFn,
  BoxPlotChartGetScaleOptionsFn as GetScaleOptionsFn,
} from "flitter-ui/chart";
export { BoxPlotChartController } from "flitter-ui/chart";

const baseDefaults: Partial<BoxPlotChartCustom> = {
  boxPlotGroup: BoxPlotGroup,
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  grid: Grid,
};

export function BaseBoxPlotChart<TConfig = {}>({
  custom,
  getScale = defaultGetScale,
  ...rest
}: {
  custom: Partial<BoxPlotChartCustom<TConfig>>;
  data: BoxPlotChartData;
  direction?: BoxPlotChartDirection;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
  config?: TConfig;
}): Widget {
  return HeadlessBoxPlotChart({
    ...rest,
    getScale,
    custom: { ...baseDefaults, ...custom } as BoxPlotChartCustom<TConfig>,
  });
}

// Re-exports
export { getScale } from "./getScale";
export { BoxPlot } from "./boxplot";
export { Outlier } from "./outlier";
export { BoxPlotGroup } from "./boxplot-group";
export { DataView } from "./data-view";
export { Layout } from "./layout";
export { Legend } from "./legend";
export { Plot } from "./plot";
export { Title } from "./title";
export { XAxis } from "./x-axis";
export { XAxisLabel } from "./x-axis-label";
export { XAxisTick } from "./x-axis-tick";
export { XAxisLine } from "./x-axis-line";
export { YAxis } from "./y-axis";
export { YAxisLabel } from "./y-axis-label";
export { YAxisTick } from "./y-axis-tick";
export { YAxisLine } from "./y-axis-line";
export { Grid } from "./grid";
export { GridXLine } from "./gridXLine";
export { GridYLine } from "./gridYLine";
export { AxisCorner } from "flitter-ui/chart";
