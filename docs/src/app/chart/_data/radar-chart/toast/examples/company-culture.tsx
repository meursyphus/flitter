"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function CompanyCultureRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Innovation", "Work-Life", "Compensation", "Growth", "Diversity"],
          datasets: [
            { legend: "Startup", values: [95, 55, 65, 88, 72] },
            { legend: "Enterprise", values: [60, 80, 90, 70, 85] },
            { legend: "Agency", values: [82, 65, 72, 78, 68] },
          ],
        },
        config: {
          colors: ["#8b5cf6", "#f59e0b", "#06b6d4"],
          radar: { fillOpacity: 0.3, strokeWidth: 1.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
