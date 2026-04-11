import type { BarChartCustom } from "@headless/bar-chart/types";
import type { GetScaleOptionsFn } from "@headless/bar-chart/types";
import type { StyleConfig } from "../../plugin";
import type { AgStackedBarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "@utils/index";
import { agBar } from "./parts/bar";
import { agBarGroup } from "./parts/bar-group";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "@styles/ag";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { Widget } from "flitter-core";

export { type AgStackedBarChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number }[] },
  context: BarChartContext<AgStackedBarChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<BarChartCustom<AgStackedBarChartConfig>> = {
  layout: cartesian.agLayout,
  bar: agBar,
  barGroup: agBarGroup,
  dataView: agDataView,
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
    cartesian.agXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width);

export const agStyleConfig: StyleConfig<AgStackedBarChartConfig> = {
  custom: agCustom,
  createConfig: (config, direction = "vertical") => {
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
