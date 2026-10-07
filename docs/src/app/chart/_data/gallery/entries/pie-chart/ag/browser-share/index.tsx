"use client";

export const galleryTitle = "Browser Market Share";

import { PieChart } from "@/lib/charts";

export function createWidget() {
  return PieChart({
    data: {
      datasets: [
        { name: "Chrome", value: 65 },
        { name: "Safari", value: 18 },
        { name: "Firefox", value: 8 },
        { name: "Edge", value: 5 },
        { name: "Other", value: 4 },
      ],
    },
    config: {
      legend: { visible: false },
      radial: { visible: false },
      dataLabel: {
        visible: true,
        formatter: (args) =>
          args.percentage >= 5 ? `${args.name}\n${args.percentage.toFixed(0)}%` : "",
      },
    },
  });
}
