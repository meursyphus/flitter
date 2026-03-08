import type { ScatterChartCustom, ScatterChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgScatterChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agScatter } from "./parts/scatter";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../_styles/ag/index";

export { type AgScatterChartConfig } from "./config";

const agCustom: Partial<ScatterChartCustom<AgScatterChartConfig>> = {
  layout: cartesian.agLayout,
  scatter: agScatter,
  dataView: agDataView,
  legend: (args, context) => agLegend(args, context, { markerShape: "circle" }),
  title: agTitle,
  axisCorner: cartesian.agAxisCorner,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  xAxis: (args, context) => cartesian.agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) => cartesian.agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(Math.min(ctx.width, ctx.height));

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgScatterChartConfig>) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
