"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function ProfitLossToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25"],
          datasets: [
            { legend: "Net Income", values: [32, -18, 45, -7, 28, -12] },
            { legend: "Operating Cash", values: [15, 22, -10, 38, -25, 19] },
          ],
        },
        config: { colors: ["#10b981", "#ef4444"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
