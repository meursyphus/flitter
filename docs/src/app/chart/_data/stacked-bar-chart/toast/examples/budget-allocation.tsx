"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function BudgetAllocationToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
          datasets: [
            { legend: "Engineering", values: [450, 480, 520, 550] },
            { legend: "Marketing", values: [200, 220, 210, 240] },
            { legend: "Sales", values: [180, 190, 200, 210] },
            { legend: "Operations", values: [120, 130, 125, 140] },
          ],
        },
        config: { colors: ["#2563eb", "#dc2626", "#059669", "#d97706"], bar: { gap: 2 } },
      })}
      width="100%"
      height="100%"
    />
  );
}
