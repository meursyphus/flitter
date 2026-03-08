import type { Widget } from "flitter-core";
import {
  Text,
  Container,
  EdgeInsets,
  TextStyle,
  BoxDecoration,
  Alignment,
  Column,
  MainAxisAlignment,
  CrossAxisAlignment,
  Expanded,
  Positioned,
  Stack,
  Border,
  BoxShadow,
} from "flitter-core";
import HeadlessTreemapChart from "@headless/treemap-chart";
import type { TreemapCustom, TreemapData } from "./types";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agLegend, agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

export type {
  TreemapContext,
  TreemapCustom,
  TreemapData,
  TreemapNode,
  TreemapLayout,
} from "./types";
export { TreemapController } from "./types";

const DEFAULT_COLORS = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
];

const baseDefaults: Partial<TreemapCustom> = {
  layout: ({ treemap }) =>
    Column({
      children: [
        Expanded({
          child: Container({
            padding: EdgeInsets.all(20),
            child: treemap,
          }),
        }),
      ],
    }),
  title: () => Container({ width: 0, height: 0 }),
  legend: (args, ctx) =>
    agLegend(args, {
      config: defaultAgCartesianBaseConfig,
      isSeriesVisible: ctx.isSeriesVisible.bind(ctx),
      toggleSeries: ctx.toggleSeries.bind(ctx),
    }),
  treemap: ({ nodes }) => Stack({ children: nodes }),
  node: ({ label, value, color, x, y, width, height, index }) =>
    Positioned({
      left: x,
      top: y,
      width,
      height,
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: agTooltipContent({
          label,
          items: {
            legend: "Value",
            color: color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
            value,
          },
          config: defaultAgCartesianBaseConfig,
        }),
        renderChild: (hovered) =>
          Container({
            decoration: new BoxDecoration({
              color: color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
              border:
                hovered
                  ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                  : undefined,
              boxShadow: hovered
                ? [new BoxShadow({ color: "rgba(0,0,0,0.18)", blurRadius: 12 })]
                : undefined,
            }),
            alignment: Alignment.center,
            child: Column({
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(label, {
                  style: new TextStyle({ fontSize: 11, color: "#ffffff" }),
                }),
                Text(String(value), {
                  style: new TextStyle({ fontSize: 10, color: "rgba(255,255,255,0.8)" }),
                }),
              ],
            }),
          }),
      }),
    }),
};

export default function TreemapChart<TConfig = {}>({
  custom,
  ...rest
}: {
  custom?: Partial<TreemapCustom<TConfig>>;
  data: TreemapData;
  config?: TConfig;
}): Widget {
  return HeadlessTreemapChart({
    ...rest,
    custom: { ...baseDefaults, ...custom } as TreemapCustom<TConfig>,
  });
}
