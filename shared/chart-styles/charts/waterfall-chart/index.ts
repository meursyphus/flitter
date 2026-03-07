import type { Widget } from "flitter-core";
import HeadlessWaterfallChart from "@headless/waterfall-chart";
import type { WaterfallChartCustom, WaterfallChartData } from "./types";
import * as Base from "./base";

export type {
  WaterfallChartContext,
  WaterfallBarType,
  WaterfallChartCustom,
  WaterfallChartData,
  WaterfallChartScale,
} from "./types";
export { WaterfallChartController } from "./types";

const baseDefaults: Partial<WaterfallChartCustom> = {
  bar: Base.Bar,
  connector: Base.Connector,
  xAxis: Base.XAxis,
  xAxisLabel: Base.XAxisLabel,
  xAxisTick: Base.XAxisTick,
  yAxis: Base.YAxis,
  yAxisLabel: Base.YAxisLabel,
  yAxisTick: Base.YAxisTick,
  dataView: Base.DataView,
  layout: Base.Layout,
  plot: Base.Plot,
  legend: Base.Legend,
  title: Base.Title,
  dataLabel: Base.DataLabel,
  xAxisLine: Base.XAxisLine,
  yAxisLine: Base.YAxisLine,
  grid: Base.Grid,
  gridXLine: Base.GridXLine,
  gridYLine: Base.GridYLine,
  axisCorner: Base.AxisCorner,
};

export default function WaterfallChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<WaterfallChartCustom<TConfig>>;
  data: WaterfallChartData;
  config?: TConfig;
}): Widget {
  return HeadlessWaterfallChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as WaterfallChartCustom<TConfig>,
  });
}
