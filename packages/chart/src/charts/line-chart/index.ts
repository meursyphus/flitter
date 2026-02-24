import { type Widget, StatelessWidget } from "flitter-core";
import type { LineChartCustom, LineChartData, LineChartScale } from "./types";
import { LineChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class BarChart extends StatelessWidget {
  #config: LineChartCustom;
  #data: LineChartData;
  #getScale: (data: LineChartData) => LineChartScale;
  #title: string;

  constructor({
    custom: {
      xAxis = Default.XAxis,
      xAxisLabel = Default.XAxisLabel,
      xAxisTick = Default.XAxisTick,
      yAxis = Default.YAxis,
      yAxisLabel = Default.YAxisLabel,
      yAxisTick = Default.YAxisTick,
      series = Default.Series,
      layout = Default.Layout,
      plot = Default.Plot,
      legend = Default.Legend,
      title: titleWidget = Default.Title,
      dataLabel = Default.DataLabel,
      line = Default.Line,
      xAxisLine = Default.XAxisLine,
      yAxisLine = Default.YAxisLine,
      grid = Default.Grid,
      gridXLine = Default.GridXLine,
      gridYLine = Default.GridYLine,
      axisCorner = Default.AxisCorner,
    } = {},
    getScale = Default.getScale,
    data,
    title = "",
  }: {
    custom?: Partial<LineChartCustom>;
    title?: string;
    data: LineChartData;
    getScale?: (data: LineChartData) => LineChartScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
    this.#title = title;
    this.#config = {
      line,
      xAxis,
      xAxisLabel,
      xAxisTick,
      xAxisLine,
      yAxis,
      yAxisLabel,
      yAxisTick,
      yAxisLine,
      series,
      layout,
      plot,
      legend,
      title: titleWidget,
      dataLabel,
      grid,
      gridXLine,
      gridYLine,
      axisCorner,
    };
  }

  override build(): Widget {
    const scale = this.#getScale(this.#data);

    return LineChartConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        scale,
        title: this.#title,
      },
      child: new Chart(),
    });
  }
}

export default classToFn(BarChart);
