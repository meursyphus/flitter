"use client";

import Widget from "@flitterjs/react";
import { Text, TextStyle } from "flitter-ui";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function ServerResponseToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
          datasets: [
            { legend: "p50 (ms)", values: [45, 42, 38, 40, 68, 120, 135, 142, 128, 95, 72, 50] },
            { legend: "p95 (ms)", values: [120, 110, 95, 105, 210, 380, 420, 445, 390, 280, 195, 130] },
            { legend: "p99 (ms)", values: [280, 250, 210, 230, 480, 720, 810, 850, 740, 520, 380, 290] },
          ],
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }) => {
            const value = parseFloat(name);
            const isAboveThreshold = value >= 500;
            return Text(name, {
              style: new TextStyle({
                fontSize: 11,
                color: isAboveThreshold ? "#dc2626" : "#94a3b8",
                fontWeight: isAboveThreshold ? "700" : undefined,
              }),
            });
          },
        },
        config: {
          colors: ["#3b82f6", "#f97316", "#dc2626"],
          line: {
            strokeWidth: 1.5,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
