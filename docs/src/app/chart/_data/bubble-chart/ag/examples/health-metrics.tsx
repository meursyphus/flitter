"use client";

import Widget from "@flitterjs/react";
import { BubbleChart } from "shared/chart";

export default function HealthMetricsAgBubble() {
  return (
    <Widget
      widget={BubbleChart({
        data: {
          datasets: [
            {
              legend: "Age 20-35",
              data: [
                { x: 22, y: 118, value: 15000, label: "Active" },
                { x: 25, y: 125, value: 22000, label: "Moderate" },
                { x: 28, y: 130, value: 8000, label: "Sedentary" },
              ],
            },
            {
              legend: "Age 36-50",
              data: [
                { x: 24, y: 122, value: 12000, label: "Active" },
                { x: 27, y: 132, value: 25000, label: "Moderate" },
                { x: 31, y: 140, value: 18000, label: "Sedentary" },
              ],
            },
            {
              legend: "Age 51-65",
              data: [
                { x: 26, y: 128, value: 8000, label: "Active" },
                { x: 30, y: 138, value: 20000, label: "Moderate" },
                { x: 34, y: 148, value: 15000, label: "Sedentary" },
              ],
            },
          ],
        },
        config: {
          bubble: { opacity: 0.5, minRadius: 8, maxRadius: 28 },
          colors: {
            fills: ["#ef4444", "#3b82f6", "#10b981"],
            strokes: ["#ef4444", "#3b82f6", "#10b981"],
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
