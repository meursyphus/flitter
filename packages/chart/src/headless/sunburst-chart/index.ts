import { type Widget, StatelessWidget } from "flitter-core";
import type {
  SunburstCustom,
  SunburstChartData,
  SunburstNode,
  FlatSegment,
} from "./types";
import { SunburstConfigProvider } from "./provider";
import * as Default from "./default";
import Chart from "./chart";
import { classToFn } from "@utils/index";

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

class SunburstChart extends StatelessWidget {
  #config: SunburstCustom;
  #data: SunburstChartData;
  #title: string;

  constructor({
    custom: {
      layout = Default.Layout,
      title: titleWidget = Default.Title,
      legend = Default.Legend,
      legendItem = Default.LegendItem,
      sunburst = Default.Sunburst,
      segment = Default.Segment,
    } = {},
    data,
    title = "",
  }: {
    custom?: Partial<SunburstCustom>;
    data: SunburstChartData;
    title?: string;
  }) {
    super();
    this.#data = data;
    this.#title = title || data.title || "";
    this.#config = {
      layout,
      title: titleWidget,
      legend,
      legendItem,
      sunburst,
      segment,
    };
  }

  override build(): Widget {
    const segments = flattenTree(this.#data.root);

    return SunburstConfigProvider({
      value: {
        custom: this.#config,
        data: this.#data,
        title: this.#title,
        segments,
      },
      child: new Chart(),
    });
  }
}

function computeNodeValue(node: SunburstNode): number {
  if (node.children && node.children.length > 0) {
    return node.children.reduce(
      (sum, child) => sum + computeNodeValue(child),
      0,
    );
  }
  return node.value ?? 0;
}

function flattenTree(root: SunburstNode): FlatSegment[] {
  const segments: FlatSegment[] = [];

  function traverse(
    node: SunburstNode,
    depth: number,
    startAngle: number,
    endAngle: number,
    parentColor: string,
    colorIndex: number,
  ) {
    const color =
      node.color ?? (depth === 1 ? DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length] : parentColor);

    if (depth > 0) {
      segments.push({
        node,
        depth,
        startAngle,
        endAngle,
        color,
      });
    }

    const children = node.children ?? [];
    if (children.length === 0) return;

    const totalValue = children.reduce(
      (sum, child) => sum + computeNodeValue(child),
      0,
    );
    if (totalValue === 0) return;

    let currentAngle = startAngle;
    children.forEach((child, i) => {
      const childValue = computeNodeValue(child);
      const angleFraction =
        (childValue / totalValue) * (endAngle - startAngle);
      const childEnd = currentAngle + angleFraction;

      traverse(child, depth + 1, currentAngle, childEnd, color, depth === 0 ? i : colorIndex);
      currentAngle = childEnd;
    });
  }

  traverse(root, 0, 0, Math.PI * 2, DEFAULT_COLORS[0], 0);
  return segments;
}

export default classToFn(SunburstChart);
