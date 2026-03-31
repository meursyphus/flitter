"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function NutritionProfileRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Protein", "Carbs", "Fat", "Fiber", "Vitamins"],
          datasets: [
            { legend: "Chicken Breast", values: [95, 5, 20, 0, 35] },
            { legend: "Brown Rice", values: [15, 90, 8, 65, 30] },
            { legend: "Avocado", values: [12, 20, 85, 55, 72] },
          ],
        },
        config: {
          colors: ["#22c55e", "#f97316", "#ef4444"],
          radar: { fillOpacity: 0.25 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
