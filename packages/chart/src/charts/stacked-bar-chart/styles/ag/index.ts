import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgStackedBarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agBar } from "./parts/bar";
import { agBarGroupBox } from "./parts/bar-group-box";
import { agBarBox } from "./parts/bar-box";
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
  agXAxisBox,
  agYAxisBox,
  agScaleOptions,
} from "@shared/styles/ag";

export { type AgStackedBarChartConfig } from "./config";

const agCustom: Partial<BarChartCustom<AgStackedBarChartConfig>> = {
  layout: agLayout,
  bar: agBar,
  barGroupBox: agBarGroupBox,
  barBox: agBarBox,
  legend: agLegend,
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
  xAxis: (args, context) =>
    agXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    agYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
  xAxisBox: agXAxisBox,
  yAxisBox: agYAxisBox,
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const agStyleConfig: StyleConfig<AgStackedBarChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
