import { type Widget, StatelessWidget } from "flitter-core";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
} from "./types";
import { StackedAreaChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class StackedAreaChart extends StatelessWidget {
  #config: StackedAreaChartCustom;
  #data: StackedAreaChartData;
  #getScale: (data: StackedAreaChartData) => StackedAreaChartScale;
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
      area = Default.Area,
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
    custom?: Partial<StackedAreaChartCustom>;
    title?: string;
    data: StackedAreaChartData;
    getScale?: (data: StackedAreaChartData) => StackedAreaChartScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
    this.#title = title;
    this.#config = {
      area,
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

    return StackedAreaChartConfigProvider({
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

export default classToFn(StackedAreaChart);
