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
          colors: [
            "#0d9488",
            "#d97706",
            "#6366f1",
            "#94a3b8",
            "#dc2626",
            "#94a3b8",
            "#94a3b8",
            "#059669",
          ],
          pie: {
            innerRadiusRatio: 0.4,
            strokeWidth: 3,
          },
          title: {
            text: "Monthly Expenses",
            visible: true,
            position: "top",
            alignment: "start",
          },
          dataLabel: {
            visible: true,
            fontSize: 11,
            fontColor: "white",
            fontWeight: "bold",
            formatter: ({ name, value }: any) =>
              value >= 500 ? `$${(value / 1000).toFixed(1)}K` : "",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
