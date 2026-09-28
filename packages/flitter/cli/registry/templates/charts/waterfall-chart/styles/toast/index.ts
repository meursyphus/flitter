import {
  SizedBox,
  type Widget,
} from "flitter-core";
import type { WaterfallChartCustom } from "@headless/waterfall-chart/types";
import type { WaterfallChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { toastBar } from "./parts/bar";
import { toastBarBox } from "./parts/bar-box";
import { toastConnector } from "./parts/connector";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import { cartesian, toastLegend, toastScaleOptions, toastTitle, tooltipContent } from "@styles/toast";

export { type WaterfallChartConfig } from "./config";

function toastTooltip(
  ...[args, context]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["tooltip"]>
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<WaterfallChartCustom<WaterfallChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.toastLayout({ title, legends, plot }, ctx),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: toastDataView,
  barBox: toastBarBox,
  bar: toastBar,
  connector: toastConnector,
  tooltip: toastTooltip,
  tooltipArea: toastTooltipArea,
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastXAxis({ line, labels, tick }, { type: "label" }, ctx),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastYAxis({ line, labels, tick }, { type: "value" }, ctx),
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.items.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  legend: (args, ctx) => toastLegend(args, ctx, { markerShape: "circle" }),
  title: (args, context) => toastTitle(args, context),
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<WaterfallChartConfig>): WaterfallChartConfig =>
    deepMerge(defaultToastConfig, config),
  getScaleOptions: (ctx: { height: number }) => toastScaleOptions(ctx.height),
};
