"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  Border,
  BorderSide,
} from "flitter-ui";
import { ToastBubbleChart as ToastBubbleChartWidget } from "shared/chart";

export default function SmallBubblestoastBubbleChart() {
  return (
    <Widget
      widget={ToastBubbleChartWidget({
        data: {
          datasets: [
            {
              legend: "Africa",
              data: [
                { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
                { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
                { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
              ],
            },
            {
              legend: "America",
              data: [
                { x: 8100, y: 71.41, value: 78410118, label: "Brazil" },
                { x: 31500, y: 79.96, value: 32507874, label: "Canada" },
                { x: 32100, y: 77.43, value: 89302754, label: "United States" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 5600, y: 71.96, value: 92988000, label: "China" },
                { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
                { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
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
            // Dashed-ring style: white fill with colored border for compact dense views
            return Container({
              width: radius * 2,
              height: radius * 2,
              decoration: new BoxDecoration({
                color: `${color}22`,
                shape: "circle",
                border: Border.all({ color, width: 2, strokeAlign: 0 }),
              }),
            });
          },
        },
        config: {
          bubble: { minRadius: 3, maxRadius: 25, opacity: 0.8 },
          colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
