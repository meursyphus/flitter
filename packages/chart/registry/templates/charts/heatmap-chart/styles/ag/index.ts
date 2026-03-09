import { GestureDetector } from "flitter-core";
import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { AgHeatmapChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { agSegment } from "./parts/segment";
import { agHeatmapLegend } from "./parts/legend";
import { DataView } from "../../base/data-view";
import {
  agTitle,
  cartesian,
} from "@styles/ag";

export { type AgHeatmapChartConfig } from "./config";

const agCustom: Partial<HeatmapCustom<AgHeatmapChartConfig>> = {
  layout: (args, ctx) =>
    cartesian.agLayout(
      { title: args.title, legends: [args.legend], plot: args.plot },
      ctx as any,
    ),
  dataView: (args, ctx) =>
    GestureDetector({
      onMouseLeave: () => ctx.setHovered(null),
      child: DataView(args, ctx),
    }),
  segment: agSegment,
  legend: agHeatmapLegend,
  title: agTitle as any,
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
