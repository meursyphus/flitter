"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  BoxShadow,
  Opacity,
} from "flitter-ui";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function MarketAnalysisToastBubble() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "Technology",
              data: [
                { x: 120, y: 18, value: 850, label: "Cloud Services" },
                { x: 85, y: 25, value: 620, label: "AI/ML" },
                { x: 200, y: 8, value: 1200, label: "Enterprise Software" },
                { x: 45, y: 35, value: 300, label: "Cybersecurity" },
              ],
            },
            {
              legend: "Healthcare",
              data: [
                { x: 90, y: 12, value: 950, label: "Pharmaceuticals" },
                { x: 60, y: 22, value: 400, label: "Biotech" },
                { x: 150, y: 6, value: 1100, label: "Medical Devices" },
              ],
            },
            {
              legend: "Finance",
              data: [
                { x: 180, y: 5, value: 1500, label: "Banking" },
                { x: 70, y: 28, value: 350, label: "Fintech" },
                { x: 110, y: 10, value: 700, label: "Insurance" },
                { x: 40, y: 40, value: 200, label: "Crypto" },
              ],
            },
            {
              legend: "Energy",
              data: [
                { x: 250, y: 3, value: 2000, label: "Oil & Gas" },
                { x: 30, y: 45, value: 180, label: "Solar" },
                { x: 55, y: 30, value: 280, label: "Wind" },
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
            const color = colors[idx % colors.length];
            const { scale } = context;
            const normValue = scale != null
              ? (value - scale.value.min) / (scale.value.max - scale.value.min || 1)
              : 0.5;
            const radius = bubbleConfig.minRadius + normValue * (bubbleConfig.maxRadius - bubbleConfig.minRadius);
            // High-growth sectors (y > 20) get full opacity + glow shadow
            const dataset = context.data.datasets.find((d: any) => d.legend === legend);
            const point = dataset?.data.find((d: any) => d.value === value);
            const isHighGrowth = point && point.y > 20;

            return Container({
              width: radius * 2,
              height: radius * 2,
              decoration: new BoxDecoration({
                color: isHighGrowth ? color : `${color}88`,
                shape: "circle",
                boxShadow: isHighGrowth
                  ? [new BoxShadow({ color: `${color}66`, blurRadius: 12 })]
                  : [],
              }),
            });
          },
        },
        config: {
          title: { text: "Market Analysis by Industry", visible: true },
          bubble: { minRadius: 8, maxRadius: 45, opacity: 0.5 },
          colors: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
