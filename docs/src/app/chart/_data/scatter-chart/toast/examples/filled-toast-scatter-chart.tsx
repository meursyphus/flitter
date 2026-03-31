"use client";

import Widget from "@flitterjs/react";
import { ToastScatterChart as ToastScatterChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function FilledToastScatterChart() {
  return (
    <Widget
      widget={ToastScatterChartWidget({
        data: {
          datasets: [
            {
              legend: "Solar",
              data: [
                { x: 120, y: 18.5, label: "US" },
                { x: 85, y: 22.1, label: "Germany" },
                { x: 200, y: 15.3, label: "China" },
                { x: 45, y: 24.8, label: "Japan" },
                { x: 30, y: 20.6, label: "India" },
                { x: 55, y: 21.2, label: "Australia" },
              ],
            },
            {
              legend: "Wind",
              data: [
                { x: 140, y: 35.2, label: "US" },
                { x: 110, y: 42.1, label: "Germany" },
                { x: 280, y: 28.7, label: "China" },
                { x: 25, y: 30.5, label: "Japan" },
                { x: 60, y: 26.4, label: "India" },
                { x: 35, y: 38.9, label: "UK" },
              ],
            },
            {
              legend: "Hydro",
              data: [
                { x: 80, y: 45.0, label: "Brazil" },
                { x: 95, y: 48.3, label: "Canada" },
                { x: 350, y: 38.2, label: "China" },
                { x: 45, y: 52.1, label: "Norway" },
                { x: 20, y: 41.7, label: "Sweden" },
              ],
            },
          ],
        },
        custom: {
          yAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const val = parseFloat(name);
            const isHigh = val >= 40;
            return Text(`${name}%`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: isHigh ? "bold" : "normal",
                color: isHigh ? "#059669" : "#64748b",
              }),
            });
          },
        },
        config: {
          scatter: { fill: true, size: 10, strokeWidth: 0 },
          colors: ["#f59e0b", "#3b82f6", "#06b6d4"],
          title: { text: "Renewable Energy Capacity vs Efficiency", visible: true },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
