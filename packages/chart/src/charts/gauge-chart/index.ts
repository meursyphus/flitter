import { type Widget, StatelessWidget } from "flitter-core";
import type { GaugeChartCustom, GaugeChartData } from "./types";
import { GaugeChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class GaugeChart extends StatelessWidget {
  #config: GaugeChartCustom;
  #data: GaugeChartData;
  #title: string;

  constructor({
    custom: {
      layout = Default.Layout,
      title: titleWidget = Default.Title,
      gauge = Default.Gauge,
      needle = Default.Needle,
      valueLabel = Default.ValueLabel,
      scale = Default.Scale,
    } = {},
    data,
    title = "",
  }: {
    custom?: Partial<GaugeChartCustom>;
    title?: string;
    data: GaugeChartData;
  }) {
    super();
    this.#data = data;
    this.#title = title || data.title || "";
    this.#config = {
      layout,
      title: titleWidget,
      gauge,
      needle,
      valueLabel,
      scale,
    };
  }

  override build(): Widget {
    const min = this.#data.min ?? 0;
    const max = this.#data.max ?? 100;
    const zones = this.#data.zones ?? [
      { min, max, color: "#e0e0e0" },
    ];

    return GaugeChartConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        title: this.#title,
        value: this.#data.value,
        min,
        max,
        zones,
      },
      child: new Chart(),
    });
  }
}

export default classToFn(GaugeChart);
