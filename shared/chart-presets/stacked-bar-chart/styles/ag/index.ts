import type { BarChartCustom } from "../../../_flitter/headless/bar-chart";
import type { GetScaleOptionsFn } from "../../../_flitter/headless/bar-chart";
import type { AgStackedBarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "../../../_flitter/shared/utils/index";
import { agBar } from "./parts/bar";
import { agBarGroup } from "./parts/bar-group";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../../ag-base/index";

export { type AgStackedBarChartConfig } from "./config";

const agCustom: Partial<BarChartCustom<AgStackedBarChartConfig>> = {
  layout: cartesian.agLayout,
  bar: agBar,
  barGroup: agBarGroup,
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
    cartesian.agXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const agStyleConfig = {
  custom: agCustom,
  createConfig: (config: DeepPartial<AgStackedBarChartConfig> | undefined, direction = "vertical") => {
    const directionOverrides = direction === "vertical"
      ? {
          grid: { ...defaultAgConfig.grid, xLine: { visible: true }, yLine: { visible: false } },
          axis: { ...defaultAgConfig.axis, xLine: { visible: true }, yLine: { visible: false } },
        }
      : {
          grid: { ...defaultAgConfig.grid, xLine: { visible: false }, yLine: { visible: true } },
          axis: { ...defaultAgConfig.axis, xLine: { visible: false }, yLine: { visible: true } },
        };
    const base = deepMerge(defaultAgConfig, directionOverrides as Partial<AgStackedBarChartConfig>);
    return deepMerge(base, config);
  },
  getScaleOptions: agGetScaleOptions,
};
