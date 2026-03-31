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

export default function TechStackAgBubble() {
  return (
    <Widget
      widget={BubbleChart({
        data: {
          datasets: [
            {
              legend: "Frontend",
              data: [
                { x: 85, y: 4.5, value: 45000, label: "React" },
                { x: 72, y: 4.7, value: 28000, label: "Vue" },
                { x: 60, y: 4.6, value: 22000, label: "Svelte" },
                { x: 40, y: 4.2, value: 15000, label: "Angular" },
                { x: 30, y: 4.8, value: 8000, label: "Solid" },
              ],
            },
            {
              legend: "Backend",
              data: [
                { x: 78, y: 4.3, value: 52000, label: "Node.js" },
                { x: 55, y: 4.4, value: 38000, label: "Go" },
                { x: 65, y: 4.6, value: 42000, label: "Python" },
                { x: 45, y: 4.5, value: 30000, label: "Rust" },
              ],
            },
            {
              legend: "Database",
              data: [
                { x: 90, y: 4.0, value: 60000, label: "PostgreSQL" },
                { x: 70, y: 4.2, value: 35000, label: "MongoDB" },
                { x: 50, y: 4.4, value: 18000, label: "Redis" },
                { x: 35, y: 4.3, value: 12000, label: "Cassandra" },
              ],
            },
          ],
        },
        custom: {
          xAxisLabel: ({ name }: any) => {
            const adoption = Number(name);
            // Mini bar indicator showing adoption level
            return Row({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(`${name}%`, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#585858",
                  }),
                }),
                SizedBox({ width: 3 }),
                Container({
                  width: Math.max(2, adoption / 5),
                  height: 4,
                  decoration: new BoxDecoration({
                    color: adoption >= 70 ? "#10b981" : adoption >= 40 ? "#f59e0b" : "#94a3b8",
                    borderRadius: BorderRadius.circular(2),
                  }),
                }),
              ],
            });
          },
        },
        config: {
          title: { text: "Tech Stack Landscape 2025", visible: true },
          subtitle: { visible: true, text: "Adoption vs satisfaction, bubble = job openings" },
          bubble: { minRadius: 5, maxRadius: 30, opacity: 0.6 },
          colors: {
            fills: ["#3b82f6", "#10b981", "#f59e0b"],
            strokes: ["#3b82f6", "#10b981", "#f59e0b"],
          },
          grid: { dash: [4, 4] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
