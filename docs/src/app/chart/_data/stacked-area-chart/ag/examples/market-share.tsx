"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export default function MarketShareAgStackedArea() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Chrome", values: [64, 63.8, 63.5, 63.2, 63, 62.8, 62.5, 62.3, 62, 61.8, 61.5, 61.2] },
            { legend: "Safari", values: [19, 19.2, 19.5, 19.8, 20, 20.3, 20.5, 20.8, 21, 21.3, 21.5, 21.8] },
            { legend: "Firefox", values: [8, 7.9, 7.8, 7.7, 7.6, 7.5, 7.4, 7.3, 7.2, 7.1, 7, 6.9] },
            { legend: "Edge", values: [5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.1] },
          ],
        },
        config: {
          colors: { fills: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"], strokes: ["#ef4444", "#3b82f6", "#f59e0b", "#10b981"] },
          area: { opacity: 0.6 },
          background: "#fafafa",
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
