"use client";

import { SankeyChart } from "@/lib/charts";

export const galleryTitle = "Clean Energy Distribution (GWh)";

export function createWidget() {
  return SankeyChart({
    data: [
      {
        from: "Solar",
        to: "Grid",
        value: 36,
      },
      {
        from: "Wind",
        to: "Grid",
        value: 44,
      },
      {
        from: "Hydro",
        to: "Grid",
        value: 20,
      },
      {
        from: "Grid",
        to: "Homes",
        value: 42,
      },
      {
        from: "Grid",
        to: "Industry",
        value: 38,
      },
      {
        from: "Grid",
        to: "Transport",
        value: 20,
      },
    ],

    config: { title: { text: galleryTitle, visible: true } },
  });
}
