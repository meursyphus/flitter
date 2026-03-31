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
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
