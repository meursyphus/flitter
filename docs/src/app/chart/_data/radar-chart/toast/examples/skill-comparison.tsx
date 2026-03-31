"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function SkillComparisonRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
          datasets: [
            { legend: "Alice", values: [90, 85, 95, 70, 80, 92] },
            { legend: "Bob", values: [75, 92, 60, 95, 65, 78] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#ef4444"],
          radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
