import type { Widget } from "flitter-core";
import { BoxPlotChart as HeadlessBoxPlotChart } from "flitter-ui/chart";
import type {
  BoxPlotChartContext,
  BoxPlotChartCustom,
  BoxPlotChartData,
  BoxPlotChartDirection,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
import * as Base from "./base";
import { styleConfig, type BoxPlotChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

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
export { type BoxPlotChartConfig } from "./style";

const baseDefaults: Partial<BoxPlotChartCustom> = {
  boxPlotGroup: Base.BoxPlotGroup,
  boxPlotBox: Base.BoxPlotBox,
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

export default function BoxPlotChart({
  config,
  custom,
  getScale = Base.getScale,
  getScaleOptions,
  direction = "vertical",
  ...rest
}: {
  config?: DeepPartial<BoxPlotChartConfig>;
  custom?: Partial<BoxPlotChartCustom<BoxPlotChartConfig>>;
  data: BoxPlotChartData;
  direction?: BoxPlotChartDirection;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return HeadlessBoxPlotChart({
    ...rest,
    getScale,
    direction,
    config: styleConfig.createConfig(config),
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as BoxPlotChartCustom<BoxPlotChartConfig>,
  });
}
