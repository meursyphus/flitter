"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function DepartmentBudgetToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Product", "Engineering", "Design", "Marketing", "Sales"],
          datasets: [
            { legend: "Salaries", values: [280, 520, 180, 210, 260] },
            { legend: "Tools & Infra", values: [45, 190, 60, 85, 40] },
            { legend: "Training", values: [30, 55, 35, 25, 45] },
            { legend: "Travel", values: [20, 15, 10, 65, 80] },
          ],
        },
        config: {
          colors: ["#6366f1", "#a78bfa", "#c4b5fd", "#ddd6fe"],
          legend: { position: "right-top" },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
