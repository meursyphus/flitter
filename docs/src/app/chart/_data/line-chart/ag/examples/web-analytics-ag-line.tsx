"use client";

import Widget from "@flitterjs/react";
import { Text, TextStyle, Column, CrossAxisAlignment, MainAxisSize } from "flitter-ui";
import { LineChart } from "shared/chart";

export default function WebAnalyticsAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["Jan\n2024", "Feb\n2024", "Mar\n2024", "Apr\n2024", "May\n2024", "Jun\n2024", "Jul\n2024", "Aug\n2024", "Sep\n2024", "Oct\n2024", "Nov\n2024", "Dec\n2024"],
          datasets: [
            { legend: "Pageviews (K)", values: [320, 345, 380, 410, 395, 430, 465, 490, 475, 510, 540, 580] },
            { legend: "Sessions (K)", values: [180, 195, 215, 230, 220, 245, 260, 275, 265, 290, 305, 325] },
            { legend: "Bounce Rate (%)", values: [42, 40, 38, 36, 37, 34, 32, 30, 31, 29, 28, 26] },
          ],
        },
        custom: {
          xAxisLabel: ({ name }: { name: string; index: number }) => {
            const parts = name.split("\n");
            return Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(parts[0], {
                  style: new TextStyle({ fontSize: 12, fontWeight: "bold", color: "#374151" }),
                }),
                Text(parts[1] ?? "", {
                  style: new TextStyle({ fontSize: 9, color: "#9ca3af" }),
                }),
              ],
            });
          },
        },
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#a855f7"], strokes: ["#0ea5e9", "#f97316", "#a855f7"] },
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
