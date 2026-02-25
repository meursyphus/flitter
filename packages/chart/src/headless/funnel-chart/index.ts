import { type Widget, StatelessWidget } from "flitter-core";
import type { FunnelChartCustom, FunnelChartData } from "./types";
import { FunnelChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class FunnelChart extends StatelessWidget {
  #config: FunnelChartCustom;
  #data: FunnelChartData;
  #title: string;

  constructor({
    custom: {
      layout = Default.Layout,
      funnel = Default.Funnel,
      stage = Default.Stage,
      stageLabel = Default.StageLabel,
      dataLabel = Default.DataLabel,
      legend = Default.Legend,
      title: titleWidget = Default.Title,
    } = {},
    data,
    title = "",
  }: {
    custom?: Partial<FunnelChartCustom>;
    title?: string;
    data: FunnelChartData;
  }) {
    super();
    this.#data = data;
    this.#title = title;
    this.#config = {
      layout,
      funnel,
      stage,
      stageLabel,
      dataLabel,
      legend,
      title: titleWidget,
    };
  }

  override build(): Widget {
    return FunnelChartConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        title: this.#title,
      },
      child: new Chart(),
    });
  }
}

export default classToFn(FunnelChart);
