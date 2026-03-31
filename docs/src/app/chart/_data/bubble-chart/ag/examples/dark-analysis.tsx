"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  BoxShadow,
} from "flitter-ui";
import { BubbleChart } from "shared/chart";

export default function DarkAnalysisAgBubble() {
  return (
    <Widget
      widget={BubbleChart({
        data: {
          datasets: [
            {
              legend: "Revenue",
              data: [
                { x: 15, y: 82, value: 920, label: "Q1 North" },
                { x: 28, y: 74, value: 1400, label: "Q2 North" },
                { x: 42, y: 91, value: 1850, label: "Q3 North" },
              ],
            },
            {
              legend: "Expenses",
              data: [
                { x: 12, y: 65, value: 680, label: "Q1 Ops" },
                { x: 25, y: 58, value: 1100, label: "Q2 Ops" },
                { x: 38, y: 70, value: 750, label: "Q3 Ops" },
              ],
            },
            {
              legend: "Profit",
              data: [
                { x: 20, y: 45, value: 240, label: "Q1 Net" },
                { x: 33, y: 52, value: 300, label: "Q2 Net" },
                { x: 45, y: 60, value: 1100, label: "Q3 Net" },
              ],
            },
          ],
        },
        custom: {
          bubble: (
            { value, legend }: any,
            context: any,
          ) => {
            const { colors, bubble: bubbleConfig } = context.config;
            const idx = context.legends.indexOf(legend);
            const fillColor = colors.fills[idx % colors.fills.length];
            const { scale } = context;
            const normValue = scale != null
              ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
              : 0.5;
            const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);
            // Neon glow effect on dark background
            return Container({
              width: radius * 2,
              height: radius * 2,
              decoration: new BoxDecoration({
                color: `${fillColor}bb`,
                shape: "circle",
                boxShadow: [
                  new BoxShadow({ color: `${fillColor}88`, blurRadius: 16 }),
                  new BoxShadow({ color: `${fillColor}44`, blurRadius: 32 }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Quarterly Analysis", visible: true, color: "#e2e8f0" },
          subtitle: { visible: true, text: "Revenue vs Expenses vs Profit", color: "#64748b" },
          background: "#0f172a",
          bubble: { minRadius: 8, maxRadius: 40, opacity: 0.7 },
          colors: {
            fills: ["#38bdf8", "#f472b6", "#a3e635"],
            strokes: ["#38bdf8", "#f472b6", "#a3e635"],
          },
          axis: {
            color: "#94a3b8",
            label: { color: "#94a3b8" },
          },
          legend: { color: "#94a3b8" },
          grid: { color: "#1e293b", dash: [3, 3] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
