import type { LineChartCustom } from "@headless/line-chart/types";
import type { GetScaleOptionsFn } from "@headless/line-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgStackedAreaChartConfig } from "./config";
import type { LineChartContext } from "@headless/line-chart/types";
import type { Widget } from "flitter-core";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agArea } from "./parts/area";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "@styles/ag";

export { type AgStackedAreaChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: LineChartContext<AgStackedAreaChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<LineChartCustom<AgStackedAreaChartConfig>> = {
  layout: cartesian.agLayout,
  line: agArea,
  dataView: agDataView,
  tooltipArea: agTooltipArea,
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

export const agStyleConfig: StyleConfig<AgStackedAreaChartConfig> = {
  custom: agCustom,
  createConfig: (config) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
