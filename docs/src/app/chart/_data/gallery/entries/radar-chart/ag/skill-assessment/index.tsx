"use client";

export const galleryTitle = "Espresso Flavor Profile";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export function createWidget() {
  return RadarChart({
    data: {
      labels: [
        "Acidity",
        "Sweetness",
        "Body",
        "Bitterness",
        "Aroma",
        "Aftertaste",
      ],
      datasets: [
        { legend: "Ethiopian Yirgacheffe", values: [85, 72, 60, 35, 90, 78] },
      ],
    },
    config: {
      legend: { visible: false },
    },
  });
}

export default function RadarChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
