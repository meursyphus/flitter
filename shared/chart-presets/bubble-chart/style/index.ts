import type { BubbleChartCustom, BubbleChartContext, BubbleChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgBubbleChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agBubble } from "./parts/bubble";
import { agDataView } from "./parts/data-view";
import type { Widget } from "flitter-ui";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "../../_shared/ag/index";

export { type AgBubbleChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: BubbleChartContext<AgBubbleChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<BubbleChartCustom<AgBubbleChartConfig>> = {
  layout: cartesian.agLayout,
  bubble: agBubble,
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

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgBubbleChartConfig>) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
