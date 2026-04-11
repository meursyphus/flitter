"use client";

export const galleryTitle = "Monthly Household Expenses ($)";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export function createWidget() {
  return StackedAreaChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      datasets: [
        { legend: "Housing", values: [1200, 1200, 1250, 1250, 1300, 1300, 1350, 1350, 1400, 1400] },
        { legend: "Food & Dining", values: [480, 520, 450, 510, 560, 620, 580, 640, 550, 590] },
        { legend: "Transport", values: [320, 280, 310, 350, 390, 420, 450, 380, 340, 360] },
        { legend: "Utilities", values: [180, 200, 170, 150, 130, 160, 210, 240, 190, 170] },
      ],
    },
    config: {
      title: { text: "Monthly Household Expenses ($)", visible: true },
      area: { opacity: 0.65, spline: true },
    },
  });
}

export default function StackedAreaChartAgMonthlyExpenses() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
