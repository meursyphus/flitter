import { Container, type Widget } from "flitter-core";
import type { CandlestickChartCustom, CandlestickChartContext } from "@headless/candlestick-chart/types";
import type { CandlestickChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import * as Cartesian from "@shared/cartesian";
import { agLegend, agTitle, agTooltipContent, cartesian } from "@styles/ag";
import { agCandlestick } from "./parts/candlestick";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";

export { type CandlestickChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config as any });
}

const agCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.agLayout(
      {
        title,
        legends: ctx.data.datasets.length > 1 ? legends : [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: agDataView,
  candlestick: agCandlestick,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
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
      x: ctx.data.labels.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  legend: ({ name, index }, ctx) =>
    agLegend(
      { name, index },
      {
        config: ctx.config as any,
        isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
      },
    ),
  title: agTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultAgConfig, config),
};
