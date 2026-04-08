import type { BulletChartCustom, BulletChartContext, BulletChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import { type Widget } from "flitter-core";
import type { AgBulletChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "flitter-ui/chart";
import { agValueBar } from "./parts/value-bar";
import { agTargetMarker } from "./parts/target-marker";
import { agRangeBar } from "./parts/range-bar";
import { agBulletGroup } from "./parts/bullet-group";
import { agDataView } from "./parts/data-view";
import { agTooltipArea } from "./parts/tooltip-area";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  agTooltipContent,
  cartesian,
} from "../../_styles/ag/index";
import * as Cartesian from "flitter-ui/chart";

export { type AgBulletChartConfig } from "./config";
export type { AgBulletChartConfig as BulletChartConfig } from "./config";

function agBulletTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: BulletChartContext<AgBulletChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<BulletChartCustom<AgBulletChartConfig>> = {
  layout: cartesian.agLayout,
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  bulletGroup: agBulletGroup,
  valueBar: agValueBar,
  targetMarker: agTargetMarker,
  rangeBar: agRangeBar,
  dataView: agDataView,
  tooltip: agBulletTooltip,
  tooltipArea: agTooltipArea,
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
  createConfig: (config: any, direction = "horizontal") => {
    const directionOverrides = direction === "vertical"
      ? {
          grid: { ...defaultAgConfig.grid, xLine: { visible: true }, yLine: { visible: false } },
          axis: { ...defaultAgConfig.axis, xLine: { visible: true }, yLine: { visible: false } },
        }
      : {
          grid: { ...defaultAgConfig.grid, xLine: { visible: false }, yLine: { visible: true } },
          axis: { ...defaultAgConfig.axis, xLine: { visible: true }, yLine: { visible: false } },
        };
    return deepMerge(deepMerge(defaultAgConfig, directionOverrides), config);
  },
  getScaleOptions: agGetScaleOptions,
};
