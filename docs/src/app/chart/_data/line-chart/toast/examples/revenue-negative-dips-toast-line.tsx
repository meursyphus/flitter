"use client";

import Widget from "@flitterjs/react";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function RevenueNegativeDipsToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            { legend: "Net Revenue ($K)", values: [12, -8, 24, -15, 32, -5, 18, 28] },
            { legend: "Operating Cash", values: [5, -12, 8, -20, 15, -3, 10, 22] },
          ],
        },
        config: {
          colors: ["#2563eb", "#f97316"],
          line: {
            strokeWidth: 2.5,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
