"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function BudgetVsActualToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            { legend: "Budget", values: [120, 135, 140, 150] },
            { legend: "Actual", values: [115, 142, 131, 158] },
          ],
        },
        config: { colors: ["#0d9488", "#d4d4d4"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
