"use client";

export const galleryTitle = "Weekend Coffee Orders by City";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export function createWidget() {
  return BarChart({
    data: {
      labels: [
        "Tokyo",
        "Paris",
        "London",
        "New York",
        "Seoul",
        "Berlin",
        "Sydney",
        "Toronto",
        "Dubai",
      ],
      datasets: [
        {
          legend: "Orders",
          values: [92, 78, 85, 70, 88, 45, 63, 51, 34],
        },
      ],
    },
    config: {
      title: { text: "Weekend Coffee Orders by City", visible: true },
      legend: { visible: false },
      bar: { cornerRadius: 2 },
    },
  });
}

export default function BarChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
