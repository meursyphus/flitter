"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export default function WebsiteClicksToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Head", "Hero", "Feat", "Price", "Review", "Foot"],
          yLabels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"],
          values: [
            [5, 12, 8, 3, 2, 4],
            [22, 45, 35, 28, 15, 10],
            [30, 55, 48, 42, 20, 12],
            [25, 50, 40, 38, 18, 11],
            [18, 38, 30, 22, 12, 8],
            [10, 25, 18, 15, 8, 6],
            [3, 8, 5, 2, 1, 2],
          ],
        },
        config: {
          heatmap: { colorRange: ["#f5f3ff", "#8b5cf6", "#4c1d95"], segment: { gap: 1 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
