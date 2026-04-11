"use client";

export const galleryTitle = "Website Traffic Sources (K visits)";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart } from "shared/chart";

export function createWidget() {
  return ToastStackedAreaChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      datasets: [
        { legend: "Organic", values: [40, 50, 60, 55, 70, 80, 95, 110, 125] },
        { legend: "Paid", values: [30, 35, 40, 45, 50, 55, 52, 58, 62] },
        { legend: "Referral", values: [20, 25, 20, 30, 25, 35, 32, 28, 38] },
      ],
    },
    config: {
      title: { text: "Website Traffic Sources (K visits)", visible: true, alignment: "center" },
      area: { opacity: 0.6, strokeWidth: 2, spline: true },
    },
  });
}

export default function StackedAreaChartToastTrafficSources() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
