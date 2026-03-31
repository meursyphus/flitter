"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export default function SkillComparisonAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: {
          labels: ["Leadership", "Problem Solving", "Communication", "Technical", "Creativity", "Teamwork"],
          datasets: [
            { legend: "Alice", values: [90, 85, 95, 70, 80, 92] },
            { legend: "Bob", values: [75, 92, 60, 95, 65, 78] },
          ],
        },
        config: {
          background: "#f0f9ff",
          radar: { fillOpacity: 0.2, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
