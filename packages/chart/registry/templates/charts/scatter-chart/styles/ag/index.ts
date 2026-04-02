import type { ScatterChartCustom, GetScaleOptionsFn, ScatterChartContext } from "@headless/scatter-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgScatterChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agScatter } from "./parts/scatter";
import { agDataView } from "./parts/data-view";
import type { Widget } from "flitter-core";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "@styles/ag";

export { type AgScatterChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: ScatterChartContext<AgScatterChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<ScatterChartCustom<AgScatterChartConfig>> = {
  layout: cartesian.agLayout,
  scatter: agScatter,
  dataView: agDataView,
  legend: (args, context) => agLegend(args, context, { markerShape: "circle" }),
  title: agTitle,
  tooltip: agTooltip,
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

export const agStyleConfig: StyleConfig<AgScatterChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
