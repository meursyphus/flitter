"use client";

import Widget from "@flitterjs/react";
import { ScatterChart } from "shared/chart";

export default function PerformanceBenchmarkAg() {
  return (
    <Widget
      widget={ScatterChart({
        data: {
          datasets: [
            {
              legend: "System A (Node.js)",
              data: [
                { x: 12, y: 8500, label: "GET /api" },
                { x: 18, y: 7200, label: "POST /data" },
                { x: 25, y: 6100, label: "PUT /update" },
                { x: 8, y: 9800, label: "GET /health" },
                { x: 35, y: 4500, label: "POST /batch" },
                { x: 15, y: 8000, label: "GET /list" },
              ],
            },
            {
              legend: "System B (Go)",
              data: [
                { x: 5, y: 15000, label: "GET /api" },
                { x: 8, y: 13500, label: "POST /data" },
                { x: 12, y: 11000, label: "PUT /update" },
                { x: 3, y: 18000, label: "GET /health" },
                { x: 20, y: 9000, label: "POST /batch" },
                { x: 6, y: 14200, label: "GET /list" },
              ],
            },
            {
              legend: "System C (Python)",
              data: [
                { x: 45, y: 3200, label: "GET /api" },
                { x: 60, y: 2800, label: "POST /data" },
                { x: 80, y: 2100, label: "PUT /update" },
                { x: 30, y: 4000, label: "GET /health" },
                { x: 100, y: 1500, label: "POST /batch" },
                { x: 50, y: 3000, label: "GET /list" },
              ],
            },
          ],
        },
        config: {
          scatter: { size: 12, strokeWidth: 3 },
          colors: {
            fills: ["#ef4444", "#3b82f6", "#10b981"],
            strokes: ["#ef4444", "#3b82f6", "#10b981"],
          },
          grid: { dash: [4, 4] },
          background: "#fafafa",
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
