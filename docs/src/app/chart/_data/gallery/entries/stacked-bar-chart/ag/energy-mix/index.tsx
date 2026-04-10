"use client";

export const galleryTitle = "Monthly Financial Overview";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export function createWidget() {
  return StackedBarChart({
    data: {
      labels: ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { legend: "Budget", values: [5000, 3000, 5000, 7000, 6000, 4000, 1000] },
        { legend: "Income", values: [8000, 4000, 7000, 2000, 6000, 3000, 5000] },
        { legend: "Expenses", values: [4000, 3000, 5000, 4000, 3000, 4000, 3000] },
        { legend: "Debt", values: [6000, 3000, 3000, 2000, 5000, 4000, 2000] },
      ],
    },
    config: {
      title: { text: "Monthly Financial Overview", visible: true },
      legend: { visible: true, position: "right" },
    },
  });
}

export default function StackedBarChartAgEnergyMix() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
