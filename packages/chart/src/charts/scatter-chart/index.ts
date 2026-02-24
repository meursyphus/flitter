import { type Widget } from "flitter-core";
import type {
  ScatterChartCustom,
  ScatterChartData,
  ScatterChartScale,
} from "./types";
import { ScatterChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";

export default function BubbleChart({
  custom = {},
  data,
  title = "",
  getScale = Default.getScale,
}: {
  custom?: Partial<ScatterChartCustom>;
  title?: string;
  data: ScatterChartData;
  getScale?: (data: ScatterChartData) => ScatterChartScale;
}): Widget {
  const mergedConfig: ScatterChartCustom = {
    scatter: custom.scatter ?? Default.Scatter,
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
    axisCorner: custom.axisCorner ?? Default.AxisCorner,
  };

  const scale = getScale(data);

  return ScatterChartConfigProvider({
    value: {
      custom: mergedConfig,
      data,
      scale,
      title,
    },
    child: new Chart(),
  });
}
