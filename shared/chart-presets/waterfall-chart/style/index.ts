import {
  SizedBox,
  type Widget,
} from "flitter-core";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { agBar } from "./parts/bar";
import { agConnector } from "./parts/connector";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";
import { agLegend, agTitle, agTooltipContent, cartesian } from "../../_styles/ag/index";

export { type WaterfallChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: any,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config as any });
}

const agCustom: Partial<WaterfallChartCustom<WaterfallChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.agLayout({ title, legends, plot }, ctx as any),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: agDataView,
  bar: agBar,
  connector: agConnector,
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
        isSeriesVisible: () => true,
        toggleSeries: () => {},
      },
    ),
  title: agTitle as any,
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<WaterfallChartConfig>): WaterfallChartConfig =>
    deepMerge(defaultAgConfig, config),
};
