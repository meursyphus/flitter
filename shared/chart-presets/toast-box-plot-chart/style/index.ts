import type { BoxPlotChartCustom } from "flitter-ui/chart";
import type { BoxPlotChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { ToastBoxPlotChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { toastBoxPlot } from "./parts/boxplot";
import { toastOutlier } from "./parts/outlier";
import { toastDataView } from "./parts/data-view";
import {
  toastTitle,
  toastLegend,
  toastScaleOptions,
  cartesian,
} from "../../_styles/toast/index";

export { type ToastBoxPlotChartConfig } from "./config";

const toastCustom: Partial<BoxPlotChartCustom<ToastBoxPlotChartConfig>> = {
  layout: cartesian.toastLayout,
  boxPlot: toastBoxPlot,
  outlier: toastOutlier,
  dataView: toastDataView,
  legend: toastLegend,
  title: toastTitle,
  axisCorner: cartesian.toastAxisCorner,
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  xAxis: (args, context) =>
    cartesian.toastXAxis(args, { type: "label" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: "value" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.height);

export const toastStyleConfig = {
  custom: toastCustom,
  createConfig: (config: DeepPartial<ToastBoxPlotChartConfig> | undefined) => {
    const base: ToastBoxPlotChartConfig = {
      ...defaultToastConfig,
      grid: { ...defaultToastConfig.grid, xLine: { visible: false }, yLine: { visible: true } },
    };
    return deepMerge(base, config);
  },
  getScaleOptions: toastGetScaleOptions,
};
