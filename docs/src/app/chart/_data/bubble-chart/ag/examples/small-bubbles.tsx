"use client";

import Widget from "@flitterjs/react";
import {
  Container,
  BoxDecoration,
  EdgeInsets,
  BorderRadius,
  Text,
  TextStyle,
  Row,
  SizedBox,
  MainAxisSize,
  CrossAxisAlignment,
} from "flitter-ui";
import { BubbleChart } from "shared/chart";

export default function SmallAgBubbleChart() {
  return (
    <Widget
      widget={BubbleChart({
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
              legend: "Asia",
              data: [
                { x: 5600, y: 71.96, value: 92988000, label: "China" },
                { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
                { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
                { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
                { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
              ],
            },
          ],
        },
        custom: {
          legend: ({ name, index }: any, context: any) => {
            const color = context.config.colors.fills[index % context.config.colors.fills.length];
            // Pill-shaped legend with count badge
            const dataset = context.data.datasets[index];
            const count = dataset?.data?.length ?? 0;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 3 }),
              decoration: new BoxDecoration({
                color: "white",
                borderRadius: BorderRadius.circular(10),
              }),
              child: Row({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container({
                    width: 8,
                    height: 8,
                    decoration: new BoxDecoration({ color, shape: "circle" }),
                  }),
                  SizedBox({ width: 5 }),
                  Text(name, {
                    style: new TextStyle({ fontSize: 11, color: "#333" }),
                  }),
                  SizedBox({ width: 4 }),
                  Container({
                    padding: EdgeInsets.symmetric({ horizontal: 5, vertical: 1 }),
                    decoration: new BoxDecoration({
                      color: `${color}22`,
                      borderRadius: BorderRadius.circular(8),
                    }),
                    child: Text(`${count}`, {
                      style: new TextStyle({ fontSize: 9, color, fontWeight: "bold" }),
                    }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          title: { text: "Tight Radius Range", visible: true },
          subtitle: { visible: true, text: "Custom legend with data-point count badges" },
          bubble: { minRadius: 2, maxRadius: 20, opacity: 0.8 },
          colors: {
            fills: ["#7c3aed", "#06b6d4", "#f97316"],
            strokes: ["#7c3aed", "#06b6d4", "#f97316"],
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
