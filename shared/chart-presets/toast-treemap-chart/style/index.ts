import type { TreemapCustom } from "flitter-ui/chart";
import {
  AnimatedScale,
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
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { tooltipContent } from "../../_styles/toast/index";

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

const toastCustom: Partial<TreemapCustom<TreemapChartConfig>> = {
  layout: ({ treemap }) =>
    Column({
      children: [
        Expanded({
          child: Container({
            padding: EdgeInsets.all(defaultToastConfig.treemap.padding),
            child: treemap,
          }),
        }),
      ],
    }),
  title: () => Container({ width: 0, height: 0 }),
  legend: () => Container({ width: 0, height: 0 }),
  treemap: ({ nodes }) => Stack({ children: nodes }),
  node: ({ label, value, color, x, y, width, height, index }) =>
    Positioned({
      left: x,
      top: y,
      width,
      height,
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: tooltipContent({
          label,
          items: {
            legend: "Value",
            color: color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
            value,
          },
          config: defaultToastConfig as any,
        }),
        renderChild: (hovered) =>
          AnimatedScale({
            duration: defaultToastConfig.animation.duration,
            scale: hovered ? 1.02 : 1,
            alignment: Alignment.center,
            child: Container({
              decoration: new BoxDecoration({
                color: color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                border:
                  hovered
                    ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                    : undefined,
                boxShadow: hovered
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 12 })]
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
    }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<TreemapChartConfig>): TreemapChartConfig =>
    deepMerge(defaultToastConfig, config),
};
