import {
  SizedBox,
  type Widget,
} from "flitter-ui";
import type { WaterfallChartCustom } from "flitter-ui/chart";
import type { WaterfallChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Cartesian from "flitter-ui/chart";
import { agBar } from "./parts/bar";
import { agBarBox } from "./parts/bar-box";
import { agConnector } from "./parts/connector";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";
import { agLegend, agTitle, agTooltipContent, agScaleOptions, cartesian } from "../../_shared/ag/index";

export { type WaterfallChartConfig } from "./config";

function agTooltip(
  ...[args, context]: Parameters<WaterfallChartCustom<WaterfallChartConfig>["tooltip"]>
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<WaterfallChartCustom<WaterfallChartConfig>> = {
  layout: ({ title, legends, plot }, ctx) =>
    cartesian.agLayout({ title, legends, plot }, ctx),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: agDataView,
  barBox: agBarBox,
  bar: agBar,
  connector: agConnector,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
  xAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agXAxis({ line, labels, tick }, { type: "label" }, ctx),
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.agYAxis({ line, labels, tick }, { type: "value" }, ctx),
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
      x: ctx.items.length,
      y: ctx.scale ? (ctx.scale.max - ctx.scale.min) / ctx.scale.step : 0,
    }),
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  legend: (args, ctx) => agLegend(args, ctx),
  title: (args, context) => agTitle(args, context),
  dataLabel: () => SizedBox.shrink(),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<WaterfallChartConfig>): WaterfallChartConfig =>
    deepMerge(defaultAgConfig, config),
  getScaleOptions: (ctx: { height: number }) => agScaleOptions(ctx.height),
};
