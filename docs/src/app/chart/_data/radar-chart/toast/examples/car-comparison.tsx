"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function CarComparisonRadar() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Performance", "Comfort", "Safety", "Fuel Economy", "Price"],
          datasets: [
            { legend: "Sedan", values: [70, 90, 88, 82, 75] },
            { legend: "SUV", values: [80, 85, 92, 55, 60] },
            { legend: "EV", values: [92, 78, 90, 95, 50] },
          ],
        },
        config: {
          colors: ["#1e40af", "#dc2626", "#064e3b"],
          radar: { fillOpacity: 0.2, strokeWidth: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
