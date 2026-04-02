import type { HeatmapCustom } from "flitter-ui/chart";
import type { AgHeatmapChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agSegment } from "./parts/segment";
import { agHeatmapLegend } from "./parts/legend";
import { AgHeatmapTooltipOverlay } from "./parts/tooltip-overlay";
import { DataView } from "../base/data-view";
import {
  agTitle,
  agTooltipContent,
  cartesian,
} from "../../_styles/ag/index";
import type { HeatmapContext } from "flitter-ui/chart";
import type { Widget } from "flitter-core";

export { type AgHeatmapChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: HeatmapContext<AgHeatmapChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<HeatmapCustom<AgHeatmapChartConfig>> = {
  layout: (args, ctx) =>
    cartesian.agLayout(
      { title: args.title, legends: [args.legend], plot: args.plot },
      ctx as any,
    ),
  dataView: (args, ctx) =>
    AgHeatmapTooltipOverlay({
      child: DataView(args, ctx),
      context: ctx,
    }),
  segment: agSegment,
  legend: agHeatmapLegend,
  title: agTitle as any,
  tooltip: agTooltip,
  axisCorner: cartesian.agAxisCorner,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "label" }, context as any),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "label" }, context as any),
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgHeatmapChartConfig>): AgHeatmapChartConfig =>
    deepMerge(defaultAgConfig, config),
};
