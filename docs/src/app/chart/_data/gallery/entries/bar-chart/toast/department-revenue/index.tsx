"use client";

export const galleryTitle = "Monthly Visitors by City";

import { ToastBarChart } from "@/lib/charts";

export function createWidget() {
  return ToastBarChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        { legend: "Seoul", values: [65, 59, 80, 81, 56, 55, 40] },
        { legend: "Seattle", values: [28, 48, 40, 19, 86, 27, 90] },
        { legend: "Sydney", values: [35, 25, 30, 45, 35, 40, 25] },
      ],
    },
    config: {
      title: { text: "Monthly Visitors by City", visible: true },
      legend: { visible: true },
    },
  });
}
