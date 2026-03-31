"use client";

import Widget from "@flitterjs/react";
import { Text, TextStyle, Container, BoxDecoration, EdgeInsets, BorderRadius, Row, SizedBox, MainAxisSize } from "flitter-ui";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function FitnessTrackerToastLine() {
  const colors = ["#8b5cf6", "#f59e0b", "#06b6d4"];

  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            { legend: "Steps (K)", values: [8.2, 10.5, 7.8, 12.1, 9.4, 15.3, 6.2] },
            { legend: "Calories (100s)", values: [22, 28, 20, 32, 25, 38, 18] },
            { legend: "Distance (km)", values: [5.8, 7.4, 5.5, 8.5, 6.6, 10.8, 4.4] },
          ],
        },
        custom: {
          legend: ({ name, index }: { name: string; index: number }) => {
            const color = colors[index % colors.length];
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 10, vertical: 4 }),
              decoration: new BoxDecoration({
                color: color + "18",
                borderRadius: BorderRadius.circular(12),
              }),
              child: Row({
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container({
                    width: 8,
                    height: 8,
                    decoration: new BoxDecoration({ color, shape: "circle" }),
                  }),
                  SizedBox({ width: 6 }),
                  Text(name, {
                    style: new TextStyle({ fontSize: 11, color, fontWeight: "600" }),
                  }),
                ],
              }),
            });
          },
        },
        config: {
          colors,
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
