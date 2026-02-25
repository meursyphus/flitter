import { type Widget, StatelessWidget } from "flitter-core";
import type { SankeyChartCustom, SankeyChartData } from "./types";
import { SankeyChartConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

class SankeyChart extends StatelessWidget {
  #config: SankeyChartCustom;
  #data: SankeyChartData;
  #computeLayout: (data: SankeyChartData) => ReturnType<typeof Default.computeLayout>;
  #title: string;

  constructor({
    custom: {
      layout = Default.Layout,
      sankey = Default.Sankey,
      node = Default.Node,
      link = Default.Link,
      nodeLabel = Default.NodeLabel,
      title: titleWidget = Default.Title,
    } = {},
    computeLayout = Default.computeLayout,
    data,
    title = "",
  }: {
    custom?: Partial<SankeyChartCustom>;
    title?: string;
    data: SankeyChartData;
    computeLayout?: (data: SankeyChartData) => ReturnType<typeof Default.computeLayout>;
  }) {
    super();
    this.#data = data;
    this.#computeLayout = computeLayout;
    this.#title = title;
    this.#config = {
      layout,
      sankey,
      node,
      link,
      nodeLabel,
      title: titleWidget,
    };
  }

  override build(): Widget {
    const sankeyLayout = this.#computeLayout(this.#data);

    return SankeyChartConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        layout: sankeyLayout,
        title: this.#title,
      },
      child: new Chart(),
    });
  }
}

export default classToFn(SankeyChart);
