import type { BoxPlotChartCustom, GetScaleOptionsFn } from "@headless/box-plot-chart/types";
import type { Widget } from "flitter-core";
import type { ToastBoxPlotChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge } from "@utils/index";
import { toastBoxPlot } from "./parts/boxplot";
import { toastBoxPlotBox } from "./parts/boxplot-box";
import { toastOutlier } from "./parts/outlier";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import {
  toastTitle,
  toastLegend,
  tooltipContent,
  toastScaleOptions,
  cartesian,
} from "@styles/toast";

export { type ToastBoxPlotChartConfig } from "./config";
export type { ToastBoxPlotChartConfig as BoxPlotChartConfig } from "./config";

function toastTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: any,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config as any });
}

const toastCustom: Partial<BoxPlotChartCustom<ToastBoxPlotChartConfig>> = {
  layout: cartesian.toastLayout,
  boxPlot: toastBoxPlot,
  boxPlotBox: toastBoxPlotBox,
  outlier: toastOutlier,
  dataView: toastDataView,
  tooltip: toastTooltip,
  tooltipArea: toastTooltipArea,
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
    cartesian.toastXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

const toastGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config: any, _direction = "vertical") =>
    deepMerge(defaultToastConfig, config),
  getScaleOptions: toastGetScaleOptions,
};
