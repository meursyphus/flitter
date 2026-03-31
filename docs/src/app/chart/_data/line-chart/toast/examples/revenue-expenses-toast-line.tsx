"use client";

import Widget from "@flitterjs/react";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function RevenueExpensesToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            { legend: "Revenue ($K)", values: [84, 92, 88, 105, 118, 112, 130, 142] },
            { legend: "Expenses ($K)", values: [62, 68, 71, 74, 80, 78, 85, 90] },
          ],
        },
        config: {
          colors: ["#10b981", "#ef4444"],
          line: {
            strokeWidth: 3,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
