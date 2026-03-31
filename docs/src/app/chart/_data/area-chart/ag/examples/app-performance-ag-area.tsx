"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function AppPerformanceAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
          datasets: [
            { legend: "CPU (%)", values: [15, 10, 68, 80, 65, 28] },
            { legend: "Memory (%)", values: [42, 38, 65, 75, 68, 48] },
          ],
        },
        config: {
          colors: { fills: ["#ef4444", "#6366f1"], strokes: ["#ef4444", "#6366f1"] },
          grid: { dash: [2, 2] },
          area: {
            strokeWidth: 1.5,
            opacity: 0.15,
            spline: true,
          },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }) => {
            const value = parseFloat(name);
            const isCritical = value >= 70;
            return Text(`${name}%`, {
              style: new TextStyle({
                fontSize: 11,
                color: isCritical ? "#ef4444" : "#6b7280",
                fontWeight: isCritical ? "700" : undefined,
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
