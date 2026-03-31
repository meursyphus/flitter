"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function EmployeeDistributionToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["Engineering", "Marketing", "Sales", "Support", "Design", "Product"],
          datasets: [
            { legend: "Junior", values: [45, 20, 25, 30, 12, 8] },
            { legend: "Mid-Level", values: [60, 25, 30, 20, 15, 12] },
            { legend: "Senior", values: [35, 15, 20, 10, 8, 10] },
          ],
        },
        config: { colors: ["#3b82f6", "#f59e0b", "#ef4444"], bar: { gap: 1 } },
      })}
      width="100%"
      height="100%"
    />
  );
}
