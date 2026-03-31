"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function ExpenseBreakdownAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Housing", value: 1800 },
            { name: "Food", value: 650 },
            { name: "Transport", value: 420 },
            { name: "Utilities", value: 280 },
            { name: "Healthcare", value: 350 },
            { name: "Entertainment", value: 200 },
            { name: "Education", value: 300 },
            { name: "Savings", value: 500 },
          ],
        },
        config: {
          pie: {
            innerRadiusRatio: 0.4,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
