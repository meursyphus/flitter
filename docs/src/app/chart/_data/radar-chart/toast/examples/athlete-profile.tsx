"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function AthleteProfileRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Speed", "Strength", "Endurance", "Agility", "Flexibility"],
          datasets: [
            { legend: "Sprinter", values: [98, 75, 50, 90, 60] },
            { legend: "Marathoner", values: [70, 55, 98, 65, 75] },
            { legend: "Gymnast", values: [72, 68, 60, 95, 98] },
          ],
        },
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981"],
          radar: { fillOpacity: 0.1, strokeWidth: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
