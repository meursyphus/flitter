import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgAreaChartConfig } from "./config";
import type { LineChartContext } from "@headless/line-chart/types";
import type { Widget } from "flitter-core";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agArea } from "./parts/area";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
  AgLineLikeTooltipOverlay,
} from "@styles/ag";

export { type AgAreaChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<AgAreaChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<LineChartCustom<AgAreaChartConfig>> = {
  layout: cartesian.agLayout,
  line: agArea,
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

export const agStyleConfig: StyleConfig<AgAreaChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
