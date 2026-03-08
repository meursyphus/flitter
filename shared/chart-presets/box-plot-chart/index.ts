import type { Widget } from "flitter-core";
import HeadlessBoxPlotChart from "../_flitter/headless/box-plot-chart";
import type {
  BoxPlotChartContext,
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";

export type {
  BoxPlotChartContext,
  BoxPlotChartCustom,
  BoxPlotDataPoint,
  BoxPlotChartData,
  BoxPlotChartScale,
  BoxPlotChartDirection,
  BoxPlotChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { BoxPlotChartController } from "./types";

const baseDefaults: Partial<BoxPlotChartCustom> = {
  boxPlotGroup: Base.BoxPlotGroup,
  boxPlot: Base.BoxPlot,
  outlier: Base.Outlier,
  xAxis: Base.XAxis,
  xAxisLabel: Base.XAxisLabel,
  xAxisTick: Base.XAxisTick,
  yAxis: Base.YAxis,
  yAxisLabel: Base.YAxisLabel,
  yAxisTick: Base.YAxisTick,
  dataView: Base.DataView,
  layout: Base.Layout,
  plot: Base.Plot,
  legend: Base.Legend,
  title: Base.Title,
  xAxisLine: Base.XAxisLine,
  yAxisLine: Base.YAxisLine,
  grid: Base.Grid,
  gridXLine: Base.GridXLine,
  gridYLine: Base.GridYLine,
  axisCorner: Base.AxisCorner,
};

export default function BoxPlotChart<TConfig = {}>({
  custom,
  getScale = Base.getScale,
  ...rest
}: {
  custom?: Partial<BoxPlotChartCustom<TConfig>>;
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
