import { type Widget, StatelessWidget } from "flitter-core";
import type { TreemapCustom, TreemapData } from "./types";
import { TreemapConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";
import { squarify } from "./squarify";

const DEFAULT_COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
];

class TreemapChart extends StatelessWidget {
  #config: TreemapCustom;
  #data: TreemapData;
  #title: string;
  #colors: string[];

  constructor({
    custom: {
      layout = Default.Layout,
      title: titleWidget = Default.Title,
      legend = Default.Legend,
      legendItem = Default.LegendItem,
      treemap = Default.Treemap,
      node = Default.Node,
    } = {},
    data,
    title = "",
    colors = DEFAULT_COLORS,
  }: {
    custom?: Partial<TreemapCustom>;
    data: TreemapData;
    title?: string;
    colors?: string[];
  }) {
    super();
    this.#data = data;
    this.#title = title ?? data.title ?? "";
    this.#colors = colors;
    this.#config = {
      layout,
      title: titleWidget,
      legend,
      legendItem,
      treemap,
      node,
    };
  }

  override build(): Widget {
    // Use a reference size of 500x400 for layout computation.
    // The nodes use Positioned with absolute coordinates inside a Stack,
    // which will be sized by its parent constraints.
    const refWidth = 500;
    const refHeight = 400;

    const nodesWithIndex = this.#data.nodes.map((n, i) => ({
      value: n.value,
      index: i,
    }));

    const layouts = squarify(nodesWithIndex, refWidth, refHeight);

    return TreemapConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        title: this.#title,
        colors: this.#colors,
        layouts,
      },
      child: new Chart(),
    });
  }
}

export default classToFn(TreemapChart);
