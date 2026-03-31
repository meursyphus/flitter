"use client";

import Widget from "@flitterjs/react";
import { RadarChart } from "shared/chart";

export default function ProductReviewAgRadar() {
  return (
    <Widget
      widget={RadarChart({
        data: {
          labels: ["Price", "Quality", "Design", "Durability", "Support"],
          datasets: [
            { legend: "Product A", values: [60, 90, 85, 95, 70] },
            { legend: "Product B", values: [85, 70, 75, 60, 90] },
            { legend: "Product C", values: [75, 80, 90, 80, 65] },
          ],
        },
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
