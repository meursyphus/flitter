import { type Widget, StatelessWidget } from "flitter-core";
import type { RadarChartCustom, RadarChartData, RadarChartScale } from "./types";
import { RadarChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class RadarChart extends StatelessWidget {
  #config: RadarChartCustom;
  #data: RadarChartData;
  #getScale: (data: RadarChartData) => RadarChartScale;
  #title: string;

  constructor({
    custom: {
      layout = Default.Layout,
      radar = Default.Radar,
      grid = Default.Grid,
      axis = Default.Axis,
      axisLabel = Default.AxisLabel,
      dataset = Default.Dataset,
      legend = Default.Legend,
      title: titleWidget = Default.Title,
    } = {},
    getScale = Default.getScale,
    data,
    title = "",
  }: {
    custom?: Partial<RadarChartCustom>;
    title?: string;
    data: RadarChartData;
    getScale?: (data: RadarChartData) => RadarChartScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
    this.#title = title;
    this.#config = {
      layout,
      radar,
      grid,
      axis,
      axisLabel,
      dataset,
      legend,
      title: titleWidget,
    };
  }

  override build(): Widget {
    const scale = this.#getScale(this.#data);

    return RadarChartConfigProvider({
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

export default classToFn(RadarChart);
