"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export default function ClassroomAttendanceToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
          yLabels: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
          values: [
            [100, 100, 80, 100, 100, 60, 100, 100],
            [80, 60, 100, 80, 100, 100, 80, 60],
            [100, 100, 100, 100, 80, 100, 100, 100],
            [60, 80, 100, 40, 80, 100, 60, 80],
            [100, 100, 100, 100, 100, 100, 80, 100],
            [80, 100, 60, 80, 100, 80, 100, 100],
          ],
        },
        config: {
          heatmap: { colorRange: ["#fecaca", "#fbbf24", "#22c55e"], segment: { gap: 2 } },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
