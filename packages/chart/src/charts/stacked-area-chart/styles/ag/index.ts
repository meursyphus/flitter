import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgStackedAreaChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agArea } from "./parts/area";
import { agSeries } from "./parts/series";
import { StackedAreaTooltipOverlay } from "./parts/tooltip-overlay";
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

export { type AgStackedAreaChartConfig } from "./config";

const agCustom: Partial<LineChartCustom<AgStackedAreaChartConfig>> = {
  layout: agLayout,
  line: agArea,
  series: (args, context) =>
    StackedAreaTooltipOverlay({
      child: agSeries(args, context),
      config: context.config,
    }),
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
    agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.height);

export const agStyleConfig: StyleConfig<AgStackedAreaChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
