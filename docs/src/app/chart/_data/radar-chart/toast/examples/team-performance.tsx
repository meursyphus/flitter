"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function TeamPerformanceRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Speed", "Quality", "Communication", "Innovation", "Reliability"],
          datasets: [
            { legend: "Frontend", values: [88, 82, 90, 85, 78] },
            { legend: "Backend", values: [75, 95, 72, 70, 92] },
            { legend: "DevOps", values: [80, 88, 68, 75, 98] },
          ],
        },
        config: {
          colors: ["#6366f1", "#ec4899", "#06b6d4"],
          radar: { fillOpacity: 0.25, strokeWidth: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
