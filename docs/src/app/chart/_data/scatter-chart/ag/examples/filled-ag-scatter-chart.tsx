"use client";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export default function FilledAgScatterChart() {
  return (
    <Widget
      widget={ScatterChart({
        data: {
          datasets: [
            {
              legend: "CPU Usage",
              data: [
                { x: 1, y: 42, label: "Server A" },
                { x: 2, y: 58, label: "Server B" },
                { x: 3, y: 35, label: "Server C" },
                { x: 4, y: 71, label: "Server D" },
                { x: 5, y: 88, label: "Server E" },
                { x: 6, y: 45, label: "Server F" },
              ],
            },
            {
              legend: "Memory Usage",
              data: [
                { x: 1, y: 65, label: "Server A" },
                { x: 2, y: 72, label: "Server B" },
                { x: 3, y: 48, label: "Server C" },
                { x: 4, y: 82, label: "Server D" },
                { x: 5, y: 91, label: "Server E" },
                { x: 6, y: 55, label: "Server F" },
              ],
            },
            {
              legend: "Disk I/O",
              data: [
                { x: 1, y: 28, label: "Server A" },
                { x: 2, y: 34, label: "Server B" },
                { x: 3, y: 22, label: "Server C" },
                { x: 4, y: 56, label: "Server D" },
                { x: 5, y: 78, label: "Server E" },
                { x: 6, y: 31, label: "Server F" },
              ],
            },
          ],
        },
        config: {
          scatter: { size: 10, strokeWidth: 2 },
          colors: {
            fills: ["#ef4444", "#8b5cf6", "#06b6d4"],
            strokes: ["#ef4444", "#8b5cf6", "#06b6d4"],
          },
          grid: { dash: [4, 4] },
          background: "#f8fafc",
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "y" ? `${name}%` : `#${name}`,
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
