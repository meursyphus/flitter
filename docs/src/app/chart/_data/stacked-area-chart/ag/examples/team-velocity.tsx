"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export default function TeamVelocityAgStackedArea() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8", "Sprint 9", "Sprint 10"],
          datasets: [
            { legend: "Frontend", values: [28, 32, 30, 35, 38, 36, 40, 42, 38, 44] },
            { legend: "Backend", values: [35, 38, 40, 42, 45, 43, 48, 46, 50, 52] },
            { legend: "Mobile", values: [18, 20, 22, 24, 26, 25, 28, 30, 32, 34] },
          ],
        },
        config: {
          colors: { fills: ["#6366f1", "#ec4899", "#f59e0b"], strokes: ["#6366f1", "#ec4899", "#f59e0b"] },
          area: { opacity: 0.55, spline: true, strokeWidth: 1.5 },
          title: { text: "Team Velocity", visible: true },
          axis: {
            label: {
              format: (name: string, _index: number, axis: string) =>
                axis === "y" ? `${name} pts` : name.replace("Sprint ", "S"),
            },
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
