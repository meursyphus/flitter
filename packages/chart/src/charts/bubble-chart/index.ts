import { type Widget, StatelessWidget } from "flitter-core";
import type {
  BubbleChartCustom,
  BubbleChartData,
  BubbleChartScale,
} from "./types";
import { BubbleChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";


export default function BubbleChart({
  custom = {},
  data,
  title = "",
  getScale = Default.getScale,
}: {
  custom?: Partial<BubbleChartCustom>;
  title?: string;
  data: BubbleChartData;
  getScale?: (data: BubbleChartData) => BubbleChartScale;
}): Widget {
  const mergedConfig: BubbleChartCustom = {
    bubble: custom.bubble ?? Default.Bubble,
    xAxis: custom.xAxis ?? Default.XAxis,
    xAxisLabel: custom.xAxisLabel ?? Default.XAxisLabel,
    xAxisTick: custom.xAxisTick ?? Default.XAxisTick,
    xAxisLine: custom.xAxisLine ?? Default.XAxisLine,
    yAxis: custom.yAxis ?? Default.YAxis,
    yAxisLabel: custom.yAxisLabel ?? Default.YAxisLabel,
    yAxisTick: custom.yAxisTick ?? Default.YAxisTick,
    yAxisLine: custom.yAxisLine ?? Default.YAxisLine,
    series: custom.series ?? Default.Series,
    layout: custom.layout ?? Default.Layout,
    plot: custom.plot ?? Default.Plot,
    legend: custom.legend ?? Default.Legend,
    title: custom.title ?? Default.Title,
    dataLabel: custom.dataLabel ?? Default.DataLabel,
    grid: custom.grid ?? Default.Grid,
    gridXLine: custom.gridXLine ?? Default.GridXLine,
    gridYLine: custom.gridYLine ?? Default.GridYLine,
  };

  const scale = getScale(data);

  return BubbleChartConfigProvider({
    value: {
      custom: mergedConfig,
      data,
      scale,
      title,
    },
    child: new Chart(),
  });
}
