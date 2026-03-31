"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";
import { Align, Alignment, Row, MainAxisSize, SizedBox, Container, BoxDecoration, BorderRadius, Text, TextStyle } from "flitter-ui";

const brandColors: Record<string, string> = {
  React: "#61dafb",
  Vue: "#42b883",
  Svelte: "#ff3e00",
};

export default function FrameworkComparisonRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Performance", "DX", "Ecosystem", "Learning Curve", "Community"],
          datasets: [
            { legend: "React", values: [82, 78, 95, 65, 98] },
            { legend: "Vue", values: [80, 92, 75, 88, 82] },
            { legend: "Svelte", values: [95, 90, 55, 92, 60] },
          ],
        },
        custom: {
          legend: ({ name, index }: any) => {
            const color = brandColors[name] || "#888";
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Container({
                  width: 10,
                  height: 10,
                  decoration: new BoxDecoration({
                    color: color,
                    borderRadius: BorderRadius.circular(5),
                  }),
                }),
                SizedBox({ width: 5 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 12,
                    fontWeight: "700",
                    color: color,
                  }),
                }),
              ],
            });
          },
        },
        config: {
          colors: ["#61dafb", "#42b883", "#ff3e00"],
          radar: { fillOpacity: 0.1, strokeWidth: 2.5 },
          legend: { gap: 20 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
