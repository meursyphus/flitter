"use client";

export const galleryTitle = "Monthly Revenue Breakdown";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart } from "shared/chart";

export function createWidget() {
  return ToastStackedBarChart({
    direction: "horizontal",
    data: {
      labels: ["June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { legend: "Revenue", values: [8000, 4000, 7000, -2000, 6000, -3000, 5000] },
        { legend: "Costs", values: [-4000, -3000, -5000, -4000, 3000, 4000, -3000] },
        { legend: "Net", values: [3000, -2000, 4000, 2000, -5000, 4000, -2000] },
      ],
    },
    config: {
      title: { text: "Monthly Revenue Breakdown", visible: true },
    },
  });
}

export default function StackedBarChartToastRegionalSales() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
