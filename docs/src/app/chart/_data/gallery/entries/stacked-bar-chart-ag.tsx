"use client";

export const galleryTitle = "Department Budget Allocation ($K)";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";

export function createWidget() {
  return StackedBarChart({
        data: {
          labels: ["Engineering", "Marketing", "Sales", "Design", "HR"],
          datasets: [
            { legend: "Salaries", values: [520, 280, 310, 190, 150] },
            { legend: "Tools", values: [85, 120, 65, 95, 30] },
            { legend: "Training", values: [45, 35, 55, 40, 60] },
          ],
        },
        config: {
          title: { text: "Department Budget Allocation ($K)", visible: true },
        },
      });
}

export default function StackedBarChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
