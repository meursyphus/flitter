"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export default function AthleteProfileAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: {
          labels: ["Speed", "Strength", "Endurance", "Agility", "Flexibility"],
          datasets: [
            { legend: "Sprinter", values: [98, 75, 50, 90, 60] },
            { legend: "Marathoner", values: [70, 55, 98, 65, 75] },
            { legend: "Gymnast", values: [72, 68, 60, 95, 98] },
          ],
        },
        config: {
          background: "#1e293b",
          colors: { fills: ["#fb923c", "#38bdf8", "#4ade80"] },
          radar: {
            fillOpacity: 0.15,
            strokeWidth: 2.5,
            gridColor: "rgba(255, 255, 255, 0.1)",
            axisColor: "rgba(255, 255, 255, 0.15)",
          },
          axis: { label: { color: "#94a3b8" } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
