"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function ProductPLMixToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
          datasets: [
            { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
            { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
            { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
          ],
        },
        config: { colors: ["#10b981", "#ef4444", "#3b82f6"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
