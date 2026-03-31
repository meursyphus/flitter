"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";

export default function ServerLoadMonitorAg() {
  return (
    <Widget
      widget={HeatmapChart({
        data: {
          xLabels: ["00", "04", "08", "12", "16", "20"],
          yLabels: ["web-01", "web-02", "api-01", "api-02", "db-01", "cache"],
          values: [
            [15, 8, 72, 85, 68, 30],
            [12, 6, 78, 90, 72, 25],
            [20, 10, 65, 80, 55, 35],
            [18, 9, 70, 82, 60, 32],
            [40, 25, 88, 95, 82, 50],
            [8, 4, 45, 60, 38, 15],
          ],
        },
        config: {
          title: { text: "Server Load", visible: true },
          background: "#111827",
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
