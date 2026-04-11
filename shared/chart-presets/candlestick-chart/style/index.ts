import type { Widget } from "flitter-ui";
import type { CandlestickChartCustom, CandlestickChartContext } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Base from "../base";
import { agTitle, agTooltipContent, agScaleOptions, cartesian } from "../../_shared/ag/index";
import { agCandlestick } from "./parts/candlestick";
import { agCandlestickBox } from "./parts/candlestick-box";
import { agDataView } from "./parts/data-view";
import { agCandlestickPlot } from "./parts/plot";
import { agTooltipArea } from "./parts/tooltip-area";
import { agRightYAxis } from "./parts/y-axis";

export { type CandlestickChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items as any, config: context.config as any });
}

const agCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.agLayout(
      {
        title,
        legends: [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    agCandlestickPlot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: agDataView,
  candlestickBox: agCandlestickBox,
  candlestick: agCandlestick,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
  xAxis: Base.XAxis as any,
  yAxis: agRightYAxis,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  grid: Base.Grid as any,
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  title: agTitle as any,
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultAgConfig, config),
  getScaleOptions: (ctx: { height: number }) => agScaleOptions(ctx.height),
};
