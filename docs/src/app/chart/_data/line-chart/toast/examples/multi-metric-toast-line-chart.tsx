"use client";

import Widget from "@flitterjs/react";
import { Text, TextStyle } from "flitter-ui";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function MultiMetricToastLineChart() {
  const colors = ["#0d9488", "#f59e0b", "#ef4444", "#8b5cf6"];
  const datasets = [
    { legend: "Revenue ($K)", values: [120, 135, 128, 142, 155, 148, 162, 170, 165, 178, 185, 195] },
    { legend: "Users (K)", values: [45, 52, 58, 63, 70, 75, 82, 88, 92, 98, 105, 112] },
    { legend: "Conversion (%)", values: [3.2, 3.5, 3.1, 3.8, 4.0, 3.6, 4.2, 4.5, 4.1, 4.6, 4.8, 5.0] },
    { legend: "Churn (%)", values: [2.8, 2.5, 2.9, 2.3, 2.1, 2.4, 2.0, 1.8, 2.2, 1.9, 1.7, 1.5] },
  ];
  const lastIndex = 11; // Dec

  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets,
        },
        custom: {
          dataLabel: ({ value, label, legend }: { value: number; label: string; legend: string }) => {
            const dsIndex = datasets.findIndex((d) => d.legend === legend);
            const labelIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(label);
            if (labelIndex !== lastIndex) return Text("", { style: new TextStyle({ fontSize: 0 }) });
            const color = colors[dsIndex % colors.length];
            return Text(String(value), {
              style: new TextStyle({ fontSize: 10, fontWeight: "bold", color }),
            });
          },
        },
        config: {
          colors,
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
