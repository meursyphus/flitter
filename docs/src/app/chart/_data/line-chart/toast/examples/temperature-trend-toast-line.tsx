"use client";

import Widget from "@flitterjs/react";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function TemperatureTrendToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Tokyo", values: [5.2, 5.7, 8.7, 13.9, 18.2, 21.4, 25.0, 26.4, 22.8, 17.5, 12.1, 7.6] },
            { legend: "London", values: [4.9, 5.0, 7.2, 9.9, 13.3, 16.4, 18.7, 18.2, 15.5, 11.8, 7.8, 5.4] },
            { legend: "New York", values: [0.6, 1.8, 5.9, 11.7, 17.1, 22.1, 24.9, 24.2, 20.2, 14.0, 8.4, 3.3] },
          ],
        },
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981"],
          line: {
            strokeWidth: 2.5,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
