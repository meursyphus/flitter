"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export default function DepartmentHeadcountAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "horizontal",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
            { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
            { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
          ],
        },
        config: {
          colors: { fills: ["#6366f1", "#ec4899", "#10b981"], strokes: ["#6366f1", "#ec4899", "#10b981"] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
