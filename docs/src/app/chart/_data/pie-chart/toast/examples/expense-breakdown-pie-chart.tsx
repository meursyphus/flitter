"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function ExpenseBreakdownPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
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
          colors: ["#0d9488", "#d97706", "#6366f1", "#ec4899", "#06b6d4", "#f43f5e", "#84cc16", "#a855f7"],
          pie: {
            innerRadiusRatio: 0.4,
            strokeWidth: 3,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
