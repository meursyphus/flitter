// index.ts
import { type Widget, StatelessWidget } from "flitter-core";
import type { HeatmapCustom, HeatmapData, HeatmapScale } from "./types";
import { HeatmapConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class HeatmapChart extends StatelessWidget {
  #config: HeatmapCustom;
  #data: HeatmapData;
  #getScale: (data: HeatmapData) => HeatmapScale;
  #title: string;

  constructor({
    custom: {
      xAxis = Default.XAxis,
      xAxisLabel = Default.XAxisLabel,
      xAxisTick = Default.XAxisTick,
      yAxis = Default.YAxis,
      yAxisLabel = Default.YAxisLabel,
      yAxisTick = Default.YAxisTick,
      heatmap = Default.Heatmap,
      segment = Default.Segment,
      layout = Default.Layout,
      plot = Default.Plot,
      title: titleWidget = Default.Title,
      xAxisLine = Default.XAxisLine,
      yAxisLine = Default.YAxisLine,
    } = {},
    getScale = Default.getScale,
    data,
    title = "",
  }: {
    custom?: Partial<HeatmapCustom>;
    title?: string;
    data: HeatmapData;
    getScale?: (data: HeatmapData) => HeatmapScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
    this.#title = title;
    this.#config = {
      layout,
      plot,
      xAxis,
      xAxisLabel,
      xAxisTick,
      xAxisLine,
      yAxis,
      yAxisLabel,
      yAxisTick,
      yAxisLine,
      heatmap,
      segment,
      title: titleWidget,
    };
  }

  override build(): Widget {
    const scale = this.#getScale(this.#data);

    return HeatmapConfigProvider({
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

export default classToFn(HeatmapChart);
