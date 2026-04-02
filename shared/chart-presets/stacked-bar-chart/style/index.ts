import type { BarChartCustom } from "flitter-ui/chart";
import type { BarChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgStackedBarChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agBar } from "./parts/bar";
import { agBarGroup } from "./parts/bar-group";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "../../_styles/ag/index";
import type { BarChartContext } from "flitter-ui/chart";
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
