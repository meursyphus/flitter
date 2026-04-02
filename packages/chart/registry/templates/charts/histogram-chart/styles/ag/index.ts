import { Container, type Widget } from "flitter-core";
import type { HistogramChartCustom } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { agTitle, cartesian } from "@styles/ag";
import { agBar } from "./parts/bar";
import { agDataView } from "./parts/data-view";

export { type HistogramChartConfig } from "./config";

const agCustom: Partial<HistogramChartCustom<HistogramChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.agLayout({ title, legends: [], plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: agDataView,
  bar: agBar,
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  grid: ({ xLine, yLine }, ctx) =>
    Cartesian.Grid({
      xLine,
      yLine,
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  title: agTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<HistogramChartConfig>): HistogramChartConfig =>
    deepMerge(defaultAgConfig, config),
};
