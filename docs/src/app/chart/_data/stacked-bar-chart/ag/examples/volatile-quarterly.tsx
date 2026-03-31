"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export default function VolatileQuarterlyAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "vertical",
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
          datasets: [
            { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
            { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
            { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
          ],
        },
        config: {
          colors: { fills: ["#059669", "#dc2626", "#3b82f6"], strokes: ["#059669", "#dc2626", "#3b82f6"] },
          grid: { dash: [4, 4] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
