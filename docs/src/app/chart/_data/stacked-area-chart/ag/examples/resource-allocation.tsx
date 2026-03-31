"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export default function ResourceAllocationStackedArea() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8"],
          datasets: [
            { legend: "Development", values: [45, 50, 48, 52, 55, 50, 53, 56] },
            { legend: "QA", values: [15, 18, 20, 22, 20, 25, 22, 24] },
            { legend: "Design", values: [12, 10, 8, 10, 12, 8, 10, 8] },
            { legend: "DevOps", values: [8, 10, 12, 10, 8, 12, 10, 12] },
          ],
        },
        config: {
          colors: { fills: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], strokes: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] },
          area: { opacity: 0.5 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
