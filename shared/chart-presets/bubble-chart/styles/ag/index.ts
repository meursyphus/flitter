import type { BubbleChartCustom, GetScaleOptionsFn } from "../../../_flitter/headless/bubble-chart";
import type { AgBubbleChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "../../../_flitter/shared/utils/index";
import { agBubble } from "./parts/bubble";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../../ag-base/index";

export { type AgBubbleChartConfig } from "./config";

const agCustom: Partial<BubbleChartCustom<AgBubbleChartConfig>> = {
  layout: cartesian.agLayout,
  bubble: agBubble,
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
  createConfig: (config?: DeepPartial<AgBubbleChartConfig>) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
