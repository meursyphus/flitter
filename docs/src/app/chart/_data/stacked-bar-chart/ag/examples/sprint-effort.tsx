"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function SprintEffortAg() {
  const datasets = [
    { legend: "Design", values: [24, 16, 12, 20, 14, 10] },
    { legend: "Development", values: [40, 56, 64, 48, 60, 72] },
    { legend: "QA", values: [8, 16, 20, 24, 18, 22] },
    { legend: "Deploy", values: [4, 8, 6, 8, 10, 8] },
  ];
  const labels = ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6"];

  return (
    <Widget
      widget={StackedBarChart({
        direction: "vertical",
        data: { labels, datasets },
        config: {
          colors: { fills: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"], strokes: ["#8b5cf6", "#3b82f6", "#f59e0b", "#ef4444"] },
          grid: { dash: [2, 2] },
        },
        custom: {
          dataLabel: (
            { value, legend, label }: { value: number; label: string; legend: string },
            context: any,
          ) => {
            const { font } = context.config;
            const labelIdx = labels.indexOf(label);
            const total = datasets.reduce((sum, ds) => sum + ds.values[labelIdx], 0);
            if (legend !== "Deploy") return Text("", { style: new TextStyle({}) });
            return Text(`${total}h`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 9,
                fontWeight: "bold",
                color: total >= 100 ? "#dc2626" : "#334155",
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
