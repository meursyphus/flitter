"use client";

export const galleryTitle = "Browser Market Share";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

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

export default function BrowserShare() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
