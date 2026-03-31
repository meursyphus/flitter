"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export default function SalesByRegionToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Elec", "Cloth", "Food", "Furn", "Sports", "Books"],
          yLabels: ["NA", "EU", "APAC", "LATAM", "ME"],
          values: [
            [420, 280, 350, 180, 220, 150],
            [380, 310, 290, 160, 190, 200],
            [510, 260, 400, 120, 170, 130],
            [180, 220, 310, 90, 140, 80],
            [150, 170, 250, 110, 200, 60],
          ],
        },
        config: {
          heatmap: { colorRange: ["#fef3c7", "#f59e0b", "#92400e"] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
