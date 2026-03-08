import type { LineChartCustom } from "flitter-ui/chart";
import type { LineChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgStackedAreaChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agArea } from "./parts/area";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../_styles/ag/index";

export { type AgStackedAreaChartConfig } from "./config";

const agCustom: Partial<LineChartCustom<AgStackedAreaChartConfig>> = {
  layout: cartesian.agLayout,
  line: agArea,
  dataView: agDataView,
  legend: agLegend,
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
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "value" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.height);

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<AgStackedAreaChartConfig>) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
