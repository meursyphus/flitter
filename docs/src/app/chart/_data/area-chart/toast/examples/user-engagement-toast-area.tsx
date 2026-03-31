"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

export default function UserEngagementToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          datasets: [
            { legend: "DAU (K)", values: [12, 15, 22, 28, 27, 35] },
            { legend: "WAU (K)", values: [45, 55, 70, 85, 82, 102] },
            { legend: "MAU (K)", values: [120, 140, 175, 210, 215, 260] },
          ],
        },
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b"],
          legend: { position: "right-top" },
          area: {
            strokeWidth: 2.5,
            opacity: 0.25,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
