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
import { toastConnector } from "./parts/connector";
import { toastDataView } from "./parts/data-view";
import { cartesian, toastLegend, toastTitle } from "@styles/toast";

export { type WaterfallChartConfig } from "./config";

const toastCustom: Partial<WaterfallChartCustom<WaterfallChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.toastLayout({ title, legends, plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: toastDataView,
  bar: toastBar,
  connector: toastConnector,
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
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
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  legend: ({ name, index }, ctx) =>
    toastLegend(
      { name, index },
      {
        config: ctx.config as any,
        isSeriesVisible: () => true,
        toggleSeries: () => {},
      },
      { markerShape: "circle" },
    ),
  title: toastTitle as any,
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<WaterfallChartConfig>): WaterfallChartConfig =>
    deepMerge(defaultToastConfig, config),
};
