"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export default function ApiMonitoringAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          datasets: [
            { legend: "Avg (ms)", values: [82, 75, 145, 210, 185, 120, 90] },
            { legend: "Peak (ms)", values: [240, 180, 420, 580, 510, 340, 260] },
          ],
        },
        config: {
          colors: { fills: ["#22c55e", "#ef4444"], strokes: ["#22c55e", "#ef4444"] },
          title: { text: "Response Time (ms)", visible: true, alignment: "start" },
          grid: { dash: [3, 3], color: "#e5e5e5", xLine: { visible: true } },
          axis: {
            yLine: { visible: false },
            tick: { enabled: true, size: 8 },
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "y" ? `${name}ms` : name,
            },
          },
          line: {
            strokeWidth: 2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
