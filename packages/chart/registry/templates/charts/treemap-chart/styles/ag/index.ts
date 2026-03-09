import type { TreemapCustom } from "@headless/treemap-chart/types";
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
import type { TreemapChartConfig } from "./config";
import { defaultAgConfig } from "./config";
import { deepMerge, type DeepPartial } from "@utils/index";
import { HoverTooltip } from "@shared/interaction/hover-tooltip";
import { agLegend, agTooltipContent, defaultAgCartesianBaseConfig } from "@styles/ag";

export { type TreemapChartConfig } from "./config";

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

const agCustom: Partial<TreemapCustom<TreemapChartConfig>> = {
  layout: ({ treemap }) =>
    Column({
      children: [
        Expanded({
          child: Container({
            padding: EdgeInsets.all(defaultAgConfig.treemap.padding),
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

export const styleConfig = {
  custom: agCustom,
  createConfig: (config?: DeepPartial<TreemapChartConfig>): TreemapChartConfig =>
    deepMerge(defaultAgConfig, config),
};
