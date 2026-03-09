import type { NetworkChartCustom } from "flitter-ui/chart";
import {
  AnimatedScale,
  Column,
  Expanded,
  Container,
  Text,
  TextStyle,
  Stack,
  Positioned,
  BoxDecoration,
  Border,
  BoxShadow,
} from "flitter-core";
import type { NetworkChartConfig } from "./config";
import { defaultToastConfig } from "./config";
import { deepMerge, type DeepPartial } from "flitter-ui/chart";
import { HoverTooltip } from "flitter-ui/chart";
import { tooltipContent } from "../../_styles/toast/index";

export { type NetworkChartConfig } from "./config";

const toastCustom: Partial<NetworkChartCustom<NetworkChartConfig>> = {
  layout: ({ title, network }) =>
    Column({
      children: [title, Expanded({ child: network })],
    }),
  network: ({ nodes, nodeLabels }) =>
    Stack({
      children: [...nodes, ...nodeLabels],
    }),
  node: ({ label, x, y, size, group, index }, ctx) =>
    Positioned({
      left: x * 100,
      top: y * 100,
      width: 24 + size * 4,
      height: 24 + size * 4,
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: tooltipContent({
          label,
          items: {
            legend: group ?? "Node size",
            color:
              ctx.config.colors[
                index % ctx.config.colors.length
              ],
            value: size,
          },
          config: ctx.config as any,
        }),
        renderChild: (hovered) =>
          AnimatedScale({
            duration: ctx.config.animation.duration,
            scale: hovered ? 1.06 : 1,
            child: Container({
              width: Infinity,
              height: Infinity,
              decoration: new BoxDecoration({
                color:
                  ctx.config.colors[
                    index % ctx.config.colors.length
                  ],
                shape: "circle",
                border:
                  hovered
                    ? Border.all({ color: "white", width: 2, strokeAlign: 1 })
                    : undefined,
                boxShadow: hovered
                  ? [new BoxShadow({ color: "rgba(0,0,0,0.22)", blurRadius: 12 })]
                  : undefined,
              }),
            }),
          }),
      }),
    }),
  edge: () => Container({ width: 0, height: 0 }),
  nodeLabel: ({ label, x, y }, ctx) =>
    Positioned({
      left: x * 100 + 30,
      top: y * 100,
      child: Text(label, {
        style: new TextStyle({ fontSize: 11, color: "#333333", fontFamily: ctx.config.font.family }),
      }),
    }),
  title: () => Container({ width: 0, height: 0 }),
  legend: ({ name }, ctx) =>
    Text(name, {
      style: new TextStyle({ fontSize: 11, color: "#666666", fontFamily: ctx.config.font.family }),
    }),
};

export const styleConfig = {
  custom: toastCustom,
  createConfig: (config?: DeepPartial<NetworkChartConfig>): NetworkChartConfig =>
    deepMerge(defaultToastConfig, config),
};
