import type { HistogramChartCustom, HistogramChartContext } from "@headless/histogram-chart/types";
import type { HistogramChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { toastTitle, tooltipContent, cartesian } from "@styles/toast";
import { toastBar } from "./parts/bar";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";
import type { Widget } from "flitter-core";
import { Container } from "flitter-core";

export { type HistogramChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: HistogramChartContext<HistogramChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config });
}

const toastCustom: Partial<HistogramChartCustom<HistogramChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.toastLayout({ title, legends: [], plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: toastDataView,
  bar: toastBar,
  tooltip: toastTooltipContent,
  tooltipArea: toastTooltipArea,
  xAxis: ({ line, labels, tick }, ctx) => cartesian.toastXAxis({ line, labels, tick } as any, { type: "label" }, ctx as any),
  yAxis: ({ line, labels, tick }, ctx) => cartesian.toastYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
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
      x: ctx.bins.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  title: toastTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<HistogramChartConfig>): HistogramChartConfig =>
    deepMerge(defaultToastConfig, config),
};
