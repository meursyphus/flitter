"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

export default function QuarterlyRevenueAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["Q1 '22", "Q2 '22", "Q3 '22", "Q4 '22", "Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23"],
          datasets: [
            { legend: "SaaS ($M)", values: [8.5, 9.2, 10.1, 11.5, 13.0, 14.8, 16.2, 18.5] },
            { legend: "On-Prem ($M)", values: [12.0, 11.5, 11.0, 10.2, 9.5, 8.8, 8.0, 7.2] },
          ],
        },
        config: {
          colors: { fills: ["#0d9488", "#d97706"], strokes: ["#0d9488", "#d97706"] },
          area: {
            strokeWidth: 2.5,
            opacity: 0.35,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
