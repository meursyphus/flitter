"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export default function QuarterlyEarningsAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
          datasets: [
            { legend: "Revenue", values: [28.5, 31.2, 29.8, 34.1] },
            { legend: "EBITDA", values: [8.4, 9.7, 8.9, 11.2] },
          ],
        },
        config: {
          colors: { fills: ["#2563eb", "#7c3aed"] },
          bar: { cornerRadius: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
