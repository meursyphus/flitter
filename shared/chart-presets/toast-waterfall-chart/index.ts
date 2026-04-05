import type { Widget } from "flitter-core";
import { WaterfallChart as HeadlessWaterfallChart } from "flitter-ui/chart";
import type {
  GetScaleFn,
  GetScaleOptionsFn,
  WaterfallChartCustom,
  WaterfallChartData,
} from "./types";
import * as Base from "./base";
import { styleConfig, type WaterfallChartConfig } from "./style";
import type { DeepPartial } from "flitter-ui/chart";

export type {
  WaterfallChartContext,
  WaterfallBarType,
  WaterfallChartRow,
  WaterfallTotal,
  WaterfallChartCustom,
  WaterfallChartData,
  WaterfallChartDatum,
  WaterfallBarGeometry,
  WaterfallChartScale,
  WaterfallChartScaleOptions,
  GetScaleFn,
  GetScaleOptionsFn,
} from "./types";
export { WaterfallChartController } from "./types";
export { type WaterfallChartConfig } from "./style";

const baseDefaults: Partial<WaterfallChartCustom> = {
  barBox: Base.BarBox,
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
  xAxisLine: Base.XAxisLine,
  yAxisLine: Base.YAxisLine,
  grid: Base.Grid,
  gridXLine: Base.GridXLine,
  gridYLine: Base.GridYLine,
  axisCorner: Base.AxisCorner,
};

export default function WaterfallChart({
  config,
  data,
  custom,
  getScale = Base.getScale,
  getScaleOptions,
}: {
  config?: DeepPartial<WaterfallChartConfig>;
  data: WaterfallChartData;
  custom?: Partial<WaterfallChartCustom<WaterfallChartConfig>>;
  getScale?: GetScaleFn;
  getScaleOptions?: GetScaleOptionsFn;
}): Widget {
  return HeadlessWaterfallChart({
    data,
    getScale,
    getScaleOptions: getScaleOptions ?? styleConfig.getScaleOptions,
    config: styleConfig.createConfig(config),
    custom: { ...baseDefaults, ...styleConfig.custom, ...custom } as WaterfallChartCustom<WaterfallChartConfig>,
  });
}
