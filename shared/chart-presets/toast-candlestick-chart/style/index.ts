import { Container, type Widget } from "flitter-core";
import type { CandlestickChartCustom, CandlestickChartContext } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import * as Base from "../base";
import * as Cartesian from "flitter-ui/chart";
import { cartesian, toastTitle, tooltipContent, toastScaleOptions } from "../../_styles/toast/index";
import { toastCandlestick } from "./parts/candlestick";
import { toastCandlestickBox } from "./parts/candlestick-box";
import { toastDataView } from "./parts/data-view";
import { toastTooltipArea } from "./parts/tooltip-area";

export { type CandlestickChartConfig } from "./config";

function toastTooltipContent(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return tooltipContent({ label: args.label, items: args.items as any, config: context.config as any });
}

const toastCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: ({ title, plot }, ctx) =>
    cartesian.toastLayout(
      {
        title,
        legends: [],
        plot,
      },
      ctx as any,
    ),
  plot: ({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }) =>
    Cartesian.Plot({ xAxis, yAxis, dataView, grid, axisCorner, tooltipArea }),
  dataView: toastDataView,
  candlestickBox: toastCandlestickBox,
  candlestick: toastCandlestick,
  tooltip: toastTooltipContent,
  tooltipArea: toastTooltipArea,
  xAxis: Base.XAxis as any,
  yAxis: ({ line, labels, tick }, ctx) =>
    cartesian.toastYAxis({ line, labels, tick } as any, { type: "value" }, ctx as any),
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  grid: Base.Grid as any,
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  axisCorner: cartesian.toastAxisCorner,
  title: toastTitle as any,
  dataLabel: () => Container({ width: 0, height: 0 }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultToastConfig, config),
  getScaleOptions: (ctx: { height: number }) => toastScaleOptions(ctx.height),
};
