"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function SalesKpiDashboardToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["West", "East", "South", "North"],
          datasets: [
            { legend: "Closed", values: [82, 67, 54, 71] },
            { legend: "Pipeline", values: [45, 38, 62, 29] },
          ],
        },
        config: {
          colors: ["#0d9488", "#a7f3d0"],
          bar: { cornerRadius: 3 },
          axis: {
            label: {
              format: (name: string, _index: number, axis: "x" | "y") =>
                axis === "y" ? `$${name}K` : name,
            },
          },
          grid: { color: "rgba(0,0,0,0.04)" },
          padding: { top: 16, right: 24, bottom: 16, left: 24 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
