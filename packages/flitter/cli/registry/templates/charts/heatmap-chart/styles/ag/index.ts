import type { HeatmapCustom } from "@headless/heatmap-chart/types";
import type { AgHeatmapChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { agSegment } from "./parts/segment";
import { agHeatmapLegend } from "./parts/legend";
import { agTooltipArea } from "./parts/tooltip-area";
import { DataView } from "../../base/data-view";
import {
  agTitle,
  agTooltipContent,
  cartesian,
} from "@styles/ag";
import type { HeatmapContext } from "@headless/heatmap-chart/types";
import type { Widget } from "flitter-core";
import { interpolateColor } from "./parts/segment";

export { type AgHeatmapChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: HeatmapContext<AgHeatmapChartConfig>,
): Widget {
  const hoveredSegment = context.hoveredSegment;
  const item = args.items[0];
  if (hoveredSegment == null || item == null) {
    return agTooltipContent({ label: args.label, items: args.items, config: context.config });
  }

  const { min, max } = context.scale;
  const fraction = max === min ? 0.5 : (hoveredSegment.value - min) / (max - min);
  const color = interpolateColor(context.config.heatmap.colorRange, fraction);
  return agTooltipContent({
    label: `${hoveredSegment.yLabel} / ${hoveredSegment.xLabel}`,
    items: [{ legend: item.legend, color, value: hoveredSegment.value }],
    config: context.config,
  });
}

const agCustom: Partial<HeatmapCustom<AgHeatmapChartConfig>> = {
  layout: (args, ctx) =>
    cartesian.agLayout(
      { title: args.title, legends: [args.legend], plot: args.plot },
      ctx,
    ),
  dataView: DataView,
  segment: agSegment,
  legend: agHeatmapLegend,
  title: (args, context) => agTitle(args, context),
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
  axisCorner: cartesian.agAxisCorner,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "label" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "label" }, context),
};

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgHeatmapChartConfig>): AgHeatmapChartConfig =>
    deepMerge(defaultAgConfig, config),
};
