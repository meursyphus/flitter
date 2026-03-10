import type { NetworkChartCustom } from "flitter-ui/chart";
import {
  Align,
  Alignment,
  AnimatedScale,
  BoxDecoration,
  Border,
  BoxShadow,
  Column,
  Container,
  CustomPaint,
  Expanded,
  FractionalTranslation,
  Offset,
  Positioned,
  SizedBox,
  Stack,
  Text,
  TextStyle,
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
  network: ({ nodes, edges, nodeLabels }) =>
    Stack({
      children: [...edges, ...nodes, ...nodeLabels],
    }),
  node: ({ label, x, y, size, group, index }, ctx) =>
    Align({
      alignment: new Alignment({ x: x * 2 - 1, y: y * 2 - 1 }),
      child: new HoverTooltip({
        position: "topCenter",
        tooltip: tooltipContent({
          label,
          items: {
            legend: group ?? "Node size",
            color: ctx.config.colors[index % ctx.config.colors.length],
            value: size,
          },
          config: ctx.config as any,
        }),
        renderChild: (hovered) =>
          SizedBox({
            width: 20 + size * 8,
            height: 20 + size * 8,
            child: AnimatedScale({
              duration: ctx.config.animation.duration,
              scale: hovered ? 1.06 : 1,
              alignment: Alignment.center,
              child: Container({
                width: Infinity,
                height: Infinity,
                decoration: new BoxDecoration({
                  color: ctx.config.colors[index % ctx.config.colors.length],
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
    }),
  edge: ({ x1, y1, x2, y2, weight }, ctx) =>
    Positioned.fill({
      child: CustomPaint({
        painter: {
          svg: {
            createDefaultSvgEl: (context) => ({
              line: context.createSvgEl("line"),
            }),
            paint: ({ line }, size) => {
              line.setAttribute("x1", `${x1 * size.width}`);
              line.setAttribute("y1", `${y1 * size.height}`);
              line.setAttribute("x2", `${x2 * size.width}`);
              line.setAttribute("y2", `${y2 * size.height}`);
              line.setAttribute("stroke", ctx.config.network.edgeColor);
              line.setAttribute(
                "stroke-width",
                `${ctx.config.network.edgeWidth + ((weight ?? 1) - 1) * 0.35}`,
              );
              line.setAttribute("stroke-opacity", "0.45");
            },
          },
          canvas: {
            paint: (context, size) => {
              const canvas = context.canvas;
              canvas.strokeStyle = ctx.config.network.edgeColor;
              canvas.lineWidth = ctx.config.network.edgeWidth + ((weight ?? 1) - 1) * 0.35;
              canvas.globalAlpha = 0.45;
              canvas.beginPath();
              canvas.moveTo(x1 * size.width, y1 * size.height);
              canvas.lineTo(x2 * size.width, y2 * size.height);
              canvas.stroke();
              canvas.globalAlpha = 1;
            },
          },
        },
      }),
    }),
  nodeLabel: ({ label, x, y }, ctx) =>
    Align({
      alignment: new Alignment({ x: x * 2 - 1, y: y * 2 - 1 }),
      child: FractionalTranslation({
        translation: new Offset({
          x: 1.1 + ctx.config.network.labelOffset / 24,
          y: -0.2,
        }),
        child: Text(label, {
        style: new TextStyle({ fontSize: 11, color: "#333333", fontFamily: ctx.config.font.family }),
        }),
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
