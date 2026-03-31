"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

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
        config: {
          colors: ["#10b981", "#ef4444", "#3b82f6"],
          title: { text: "Quarterly P&L Mix", visible: true },
          grid: { color: "rgba(0,0,0,0.06)" },
        },
        custom: {
          yAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const val = parseFloat(name);
            const isZero = val === 0;
            return Text(isZero ? "--- 0 ---" : name, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: isZero ? "bold" : "normal",
                color: isZero ? "#ef4444" : val < 0 ? "#94a3b8" : "#334155",
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
