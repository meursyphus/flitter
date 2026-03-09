import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { BoxPlotChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgBoxPlotChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agBoxPlot } from "./parts/boxplot";
import { agOutlier } from "./parts/outlier";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../_styles/ag/index";

export { type AgBoxPlotChartConfig } from "./config";

const agCustom: Partial<BoxPlotChartCustom<AgBoxPlotChartConfig>> = {
  layout: cartesian.agLayout,
  boxPlot: agBoxPlot,
  outlier: agOutlier,
  dataView: agDataView,
  legend: agLegend,
  title: agTitle,
  axisCorner: cartesian.agAxisCorner,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "label" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.height);

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config: DeepPartial<AgBoxPlotChartConfig> | undefined) => {
    const base: AgBoxPlotChartConfig = {
      ...defaultAgConfig,
      grid: { ...defaultAgConfig.grid, xLine: { visible: false }, yLine: { visible: true } },
      axis: { ...defaultAgConfig.axis, xLine: { visible: true }, yLine: { visible: false } },
    };
    return deepMerge(base, config);
  },
  getScaleOptions: agGetScaleOptions,
};
