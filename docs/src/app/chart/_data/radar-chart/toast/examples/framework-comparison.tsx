"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function FrameworkComparisonRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Performance", "DX", "Ecosystem", "Learning Curve", "Community"],
          datasets: [
            { legend: "React", values: [82, 78, 95, 65, 98] },
            { legend: "Vue", values: [80, 92, 75, 88, 82] },
            { legend: "Svelte", values: [95, 90, 55, 92, 60] },
          ],
        },
        config: {
          colors: ["#61dafb", "#42b883", "#ff3e00"],
          radar: { fillOpacity: 0.15, strokeWidth: 2.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
