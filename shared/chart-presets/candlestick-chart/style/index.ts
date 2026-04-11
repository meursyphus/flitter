import type { Widget } from "flitter-ui";
import type { CandlestickChartCustom, CandlestickChartContext } from "flitter-ui/chart";
import type { CandlestickChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { agTitle, agTooltipContent, agScaleOptions, cartesian } from "../../_shared/ag/index";
import { agCandlestick } from "./parts/candlestick";
import { agCandlestickBox } from "./parts/candlestick-box";
import { agTooltipArea } from "./parts/tooltip-area";

export { type CandlestickChartConfig } from "./config";

function agTooltip(
  args: { label: string; items: { legend: string; color: string; value: number | string }[] },
  context: CandlestickChartContext<CandlestickChartConfig>,
): Widget {
  return agTooltipContent({ label: args.label, items: args.items, config: context.config });
}

const agCustom: Partial<CandlestickChartCustom<CandlestickChartConfig>> = {
  layout: (args, context) => cartesian.agLayout(args, context),
  candlestickBox: agCandlestickBox,
  candlestick: agCandlestick,
  tooltip: agTooltip,
  tooltipArea: agTooltipArea,
  xAxisLabel: cartesian.agXAxisLabel,
  yAxisLabel: cartesian.agYAxisLabel,
  xAxisTick: cartesian.agXAxisTick,
  yAxisTick: cartesian.agYAxisTick,
  xAxisLine: cartesian.agXAxisLine,
  yAxisLine: cartesian.agYAxisLine,
  gridXLine: cartesian.agGridXLine,
  gridYLine: cartesian.agGridYLine,
  axisCorner: cartesian.agAxisCorner,
  title: (args, context) => agTitle(args, context),
};

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<CandlestickChartConfig>): CandlestickChartConfig =>
    deepMerge(defaultAgConfig, config),
  getScaleOptions: (ctx: { height: number }) => agScaleOptions(ctx.height),
};
