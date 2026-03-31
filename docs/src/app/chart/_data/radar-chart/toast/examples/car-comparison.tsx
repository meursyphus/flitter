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
          colors: ["#38bdf8", "#f472b6", "#a3e635"],
          radar: {
            fillOpacity: 0.2,
            strokeWidth: 2.5,
            gridColor: "rgba(255, 255, 255, 0.12)",
            gridWidth: 1,
            axisColor: "rgba(255, 255, 255, 0.2)",
            axisWidth: 1,
          },
          axis: { label: { color: "#94a3b8" } },
          title: { text: "Vehicle Comparison", visible: true, color: "#e2e8f0" },
          tooltip: { backgroundColor: "rgba(15, 23, 42, 0.9)", textColor: "#f1f5f9" },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
