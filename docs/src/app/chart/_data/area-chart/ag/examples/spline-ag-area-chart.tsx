"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

export default function SplineAgAreaChart() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
            { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
            { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
          ],
        },
        config: {
          colors: { fills: ["#7c3aed", "#0ea5e9"], strokes: ["#7c3aed", "#0ea5e9"] },
          grid: { dash: [4, 4] },
          area: {
            strokeWidth: 2,
            opacity: 0.2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
