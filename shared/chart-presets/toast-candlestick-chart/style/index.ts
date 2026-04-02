import { Container, type Widget } from "flitter-core";
import type { CandlestickChartCustom, CandlestickChartContext } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { cartesian, toastLegend, toastTitle, tooltipContent } from "../../_styles/toast/index";
import { toastCandlestick } from "./parts/candlestick";
import { toastDataView } from "./parts/data-view";

export { type CandlestickChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items, config: context.config as any });
}

const toastCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.toastLayout(
      {
        title,
        legends: ctx.data.datasets.length > 1 ? legends : [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  dataView: toastDataView,
  candlestick: toastCandlestick,
  tooltip: toastTooltipContent,
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
        isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
        toggleSeries: ctx.toggleSeries.bind(ctx),
      },
      { markerShape: "circle" },
    ),
  title: toastTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultToastConfig, config),
};
