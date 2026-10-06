"use client";

export const galleryTitle = "Espresso Flavor Profile";

import { RadarChart } from "@/lib/charts";

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
