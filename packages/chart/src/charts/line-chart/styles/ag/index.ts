import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgLineChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agLine } from "./parts/line";
import { agSeries } from "./parts/series";
import { LineTooltipOverlay } from "./parts/tooltip-overlay";
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

export { type AgLineChartConfig } from "./config";

const agCustom: Partial<LineChartCustom<AgLineChartConfig>> = {
  layout: agLayout,
  line: agLine,
  series: (args, context) =>
    LineTooltipOverlay({
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
  xAxisBox: agXAxisBox,
  yAxisBox: agYAxisBox,
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.height);

export const agStyleConfig: StyleConfig<AgLineChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
