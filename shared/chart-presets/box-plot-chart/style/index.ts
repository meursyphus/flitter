import type { BoxPlotChartCustom, BoxPlotChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { Widget } from "flitter-ui";
import type { AgBoxPlotChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "flitter-ui/chart";
import {
  agTitle,
  agLegend,
  agTooltipContent,
  agScaleOptions,
  cartesian,
} from "../../_shared/ag/index";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";

export { type AgBoxPlotChartConfig } from "./config";
export type { AgBoxPlotChartConfig as BoxPlotChartConfig } from "./config";

function agTooltip(
  ...[args, context]: Parameters<BoxPlotChartCustom<AgBoxPlotChartConfig>["tooltip"]>
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<BoxPlotChartCustom<AgBoxPlotChartConfig>> = {
  dataView: agDataView,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
  layout: cartesian.agLayout,
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

export const styleConfig = {
  custom: agCustom,
  createConfig: (config: any, _direction = "vertical") => {
    const base = deepMerge(defaultAgConfig, {
      grid: { xLine: { visible: true }, yLine: { visible: false } },
      axis: { xLine: { visible: true }, yLine: { visible: false } },
    });
    return deepMerge(base, config);
  },
  getScaleOptions: agGetScaleOptions,
};
