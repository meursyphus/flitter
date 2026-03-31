"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export default function TeamPerformanceAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: {
          labels: ["Speed", "Quality", "Communication", "Innovation", "Reliability"],
          datasets: [
            { legend: "Frontend", values: [88, 82, 90, 85, 78] },
            { legend: "Backend", values: [75, 95, 72, 70, 92] },
            { legend: "DevOps", values: [80, 88, 68, 75, 98] },
          ],
        },
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
