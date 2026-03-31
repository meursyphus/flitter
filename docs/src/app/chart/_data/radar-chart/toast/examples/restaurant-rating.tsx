"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function RestaurantRatingRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Food", "Service", "Ambiance", "Value", "Location"],
          datasets: [
            { legend: "Chez Marie", values: [95, 88, 92, 65, 78] },
            { legend: "Tokyo Ramen", values: [90, 72, 68, 92, 85] },
            { legend: "Burger Joint", values: [78, 80, 55, 95, 90] },
          ],
        },
        config: {
          colors: ["#d97706", "#dc2626", "#059669"],
          radar: { fillOpacity: 0.35, strokeWidth: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
