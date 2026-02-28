import { type Widget, StatelessWidget } from "flitter-core";
import type {
  StackedAreaChartCustom,
  StackedAreaChartData,
  StackedAreaChartScale,
} from "./types";
import { StackedAreaChartConfigProvider } from "./provider";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class StackedAreaChart extends StatelessWidget {
  #config: StackedAreaChartCustom;
  #data: StackedAreaChartData;
  #getScale: (data: StackedAreaChartData) => StackedAreaChartScale;
  #title: string;

  constructor({
    custom,
    getScale,
    data,
    title = "",
  }: {
    custom: StackedAreaChartCustom;
    title?: string;
    data: StackedAreaChartData;
    getScale: (data: StackedAreaChartData) => StackedAreaChartScale;
  }) {
    super();
    this.#data = data;
    this.#getScale = getScale;
    this.#title = title;
    this.#config = custom;
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
