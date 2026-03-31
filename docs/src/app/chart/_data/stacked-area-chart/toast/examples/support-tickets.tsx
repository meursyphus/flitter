"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";

export default function SupportTicketsToastStackedArea() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Bug Reports", values: [85, 78, 92, 88, 75, 70, 65, 72, 80, 68, 62, 58] },
            { legend: "Feature Requests", values: [45, 52, 48, 55, 60, 65, 70, 68, 72, 78, 82, 88] },
            { legend: "Questions", values: [120, 115, 108, 100, 95, 90, 88, 85, 82, 78, 75, 70] },
            { legend: "Billing", values: [30, 28, 32, 35, 30, 28, 25, 27, 30, 32, 28, 25] },
          ],
        },
        config: {
          colors: ["#ef4444", "#6366f1", "#06b6d4", "#f59e0b"],
          area: { opacity: 0.35 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
