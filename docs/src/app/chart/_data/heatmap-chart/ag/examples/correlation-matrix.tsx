"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";

export default function CorrelationMatrixAg() {
  return (
    <Widget
      widget={HeatmapChart({
        data: {
          xLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
          yLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
          values: [
            [100, 85, 78, -45, 62, 70],
            [85, 100, 92, -52, 58, 75],
            [78, 92, 100, -60, 65, 82],
            [-45, -52, -60, 100, -38, -55],
            [62, 58, 65, -38, 100, 72],
            [70, 75, 82, -55, 72, 100],
          ],
        },
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
