"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function CompanyCultureRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Innovation", "Work-Life", "Compensation", "Growth", "Diversity", "Leadership"],
          datasets: [
            { legend: "Startup", values: [95, 55, 65, 88, 72, 60] },
            { legend: "Enterprise", values: [60, 80, 90, 70, 85, 92] },
            { legend: "Agency", values: [82, 65, 72, 78, 68, 74] },
          ],
        },
        config: {
          colors: ["#c084fc", "#fbbf24", "#67e8f9"],
          radar: {
            fillOpacity: 0.25,
            strokeWidth: 1.5,
            gridColor: "rgba(192, 132, 252, 0.1)",
            gridWidth: 1.5,
          },
          title: { text: "Workplace Culture Index", visible: true, alignment: "center", fontSize: 16 },
          legend: { gap: 16 },
          padding: { top: 16, right: 24, bottom: 16, left: 24 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
