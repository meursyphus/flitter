"use client";

export const galleryTitle = "Activity by Day & Hour";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export function createWidget() {
  return ToastHeatmapChart({
        data: {
          xLabels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [2, 5, 12, 18, 15, 10, 6, 3],
            [3, 7, 14, 20, 17, 12, 8, 4],
            [1, 4, 11, 16, 14, 9, 5, 2],
            [4, 8, 15, 22, 19, 13, 9, 5],
            [5, 9, 16, 24, 21, 15, 11, 7],
            [8, 12, 20, 28, 25, 18, 14, 10],
            [6, 10, 17, 23, 20, 14, 10, 6],
          ],
        },
        config: {
          title: { text: "Activity by Day & Hour", visible: true },
        },
      });
}

export default function HeatmapChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
