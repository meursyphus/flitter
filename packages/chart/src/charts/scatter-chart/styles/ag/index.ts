import type { ScatterChartCustom, GetScaleOptionsFn } from "@headless/scatter-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgScatterChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agScatter } from "./parts/scatter";
import { agSeries } from "./parts/series";
import { ScatterTooltipOverlay } from "./parts/tooltip-overlay";
import {
  agLayout,
  agTitle,
  agLegend,
  agXAxisLabel,
  agYAxisLabel,
  agXAxisTick,
  agYAxisTick,
  agXAxisLine,
  agYAxisLine,
  agGridXLine,
  agGridYLine,
  agAxisCorner,
  agXAxis,
  agYAxis,
  agScaleOptions,
} from "@shared/styles/ag";

export { type AgScatterChartConfig } from "./config";

const agCustom: Partial<ScatterChartCustom<AgScatterChartConfig>> = {
  layout: agLayout,
  scatter: agScatter,
  series: (args, context) =>
    ScatterTooltipOverlay({
      child: agSeries(args, context),
      config: context.config,
    }),
  legend: (args, context) => agLegend(args, context, { markerShape: "circle" }),
  title: agTitle,
  axisCorner: agAxisCorner,
  xAxisLabel: agXAxisLabel,
  yAxisLabel: agYAxisLabel,
  xAxisTick: agXAxisTick,
  yAxisTick: agYAxisTick,
  xAxisLine: agXAxisLine,
  yAxisLine: agYAxisLine,
  gridXLine: agGridXLine,
  gridYLine: agGridYLine,
  xAxis: (args, context) => agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) => agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(Math.min(ctx.width, ctx.height));

export const agStyleConfig: StyleConfig<AgScatterChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
