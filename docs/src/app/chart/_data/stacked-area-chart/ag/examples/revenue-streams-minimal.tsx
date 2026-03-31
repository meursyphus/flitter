"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export default function RevenueStreamsMinimalAg() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
          datasets: [
            { legend: "SaaS", values: [3200, 3600, 4100, 4500, 5000, 5400] },
            { legend: "Services", values: [1400, 1500, 1350, 1600, 1700, 1550] },
            { legend: "Licensing", values: [800, 850, 900, 950, 1000, 1050] },
          ],
        },
        config: {
          colors: { fills: ["#4f46e5", "#0891b2", "#ca8a04"], strokes: ["#4f46e5", "#0891b2", "#ca8a04"] },
          area: { opacity: 0.4 },
          axis: { xLine: { visible: false } },
          background: "#fafafa",
          grid: { dash: [3, 3], color: "#e5e5e5" },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
