"use client";

import Widget from "@flitterjs/react";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function CompactSparklineToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["", "", "", "", "", "", "", "", "", ""],
          datasets: [
            { legend: "Trend", values: [42, 48, 45, 53, 50, 58, 55, 62, 60, 68] },
          ],
        },
        config: {
          colors: ["#6366f1"],
          legend: { visible: false },
          padding: { top: 4, bottom: 4, left: 4, right: 4 },
          line: {
            strokeWidth: 2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
