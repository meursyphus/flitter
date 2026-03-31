"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export default function ActivityCalendarToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [0, 3, 1, 0, 5, 2, 4, 0, 1, 6, 3, 0],
            [2, 0, 4, 1, 0, 7, 0, 3, 5, 0, 2, 1],
            [1, 5, 0, 3, 2, 0, 6, 1, 0, 4, 0, 3],
            [0, 2, 3, 0, 4, 1, 0, 5, 2, 0, 7, 0],
            [3, 0, 2, 5, 0, 3, 1, 0, 4, 2, 0, 5],
            [0, 1, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
          ],
        },
        config: {
          title: { text: "Contributions", visible: true },
          heatmap: { colorRange: ["#ebedf0", "#9be9a8", "#216e39"], segment: { gap: 2 } },
          padding: { top: 10, right: 10, bottom: 10, left: 10 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
