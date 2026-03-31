"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export default function CustomerJourneyToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Aware", "Consider", "Decide", "Buy", "Retain"],
          yLabels: ["Organic", "Social", "Email", "Ads", "Referral"],
          values: [
            [85, 60, 40, 25, 50],
            [70, 55, 30, 18, 35],
            [30, 45, 65, 55, 70],
            [90, 50, 35, 20, 15],
            [40, 60, 55, 45, 65],
          ],
        },
        config: {
          heatmap: { colorRange: ["#e0f2fe", "#0ea5e9", "#0c4a6e"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
