import type { LineChartCustom } from "flitter-ui/chart";
import type { LineChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgLineChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agLine } from "./parts/line";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
  AgLineLikeTooltipOverlay,
} from "../../_styles/ag/index";
import type { LineChartContext } from "flitter-ui/chart";
import type { Widget } from "flitter-core";

export { type AgLineChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<AgLineChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<LineChartCustom<AgLineChartConfig>> = {
  layout: cartesian.agLayout,
  line: agLine,
  dataView: (args, context) =>
    AgLineLikeTooltipOverlay({
      child: agDataView(args, context),
      config: context.config,
    }),
  legend: agLegend,
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
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.height);

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgLineChartConfig>) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
