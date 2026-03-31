"use client";

import Widget from "@flitterjs/react";
import { ToastRadarChart } from "shared/chart";

export default function ProductReviewRadarChart() {
  return (
    <Widget
      widget={ToastRadarChart({
        data: {
          labels: ["Price", "Quality", "Design", "Durability", "Support"],
          datasets: [
            { legend: "Product A", values: [60, 90, 85, 95, 70] },
            { legend: "Product B", values: [85, 70, 75, 60, 90] },
            { legend: "Product C", values: [75, 80, 90, 80, 65] },
          ],
        },
        config: {
          colors: ["#10b981", "#f97316", "#8b5cf6"],
          radar: { fillOpacity: 0.2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
