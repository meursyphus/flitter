import type { BulletChartCustom, BulletChartGetScaleOptionsFn as GetScaleOptionsFn } from "flitter-ui/chart";
import type { AgBulletChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge } from "flitter-ui/chart";
import { agValueBar } from "./parts/value-bar";
import { agTargetMarker } from "./parts/target-marker";
import { agRangeBar } from "./parts/range-bar";
import { agBulletGroup } from "./parts/bullet-group";
import { agDataView } from "./parts/data-view";
import {
  agTitle,
  agLegend,
  agScaleOptions,
  cartesian,
} from "../../_styles/ag/index";
import * as Cartesian from "flitter-ui/chart";

export { type AgBulletChartConfig } from "./config";
export type { AgBulletChartConfig as BulletChartConfig } from "./config";

const agCustom: Partial<BulletChartCustom<AgBulletChartConfig>> = {
  layout: cartesian.agLayout,
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner }),
  bulletGroup: agBulletGroup,
  valueBar: agValueBar,
  targetMarker: agTargetMarker,
  rangeBar: agRangeBar,
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
  // Bullet chart is always horizontal: X = value, Y = label
  xAxis: (args, context) =>
    cartesian.agXAxis(args, { type: "value" }, context),
  yAxis: (args, context) =>
    cartesian.agYAxis(args, { type: "label" }, context),
};

const agGetScaleOptions: GetScaleOptionsFn = (ctx) =>
  agScaleOptions(ctx.width);

export const styleConfig = {
  custom: agCustom,
  createConfig: (config: any) => deepMerge(defaultAgConfig, config),
  getScaleOptions: agGetScaleOptions,
};
