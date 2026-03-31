"use client";

import Widget from "@flitterjs/react";
import { Text, TextStyle } from "flitter-ui";
import { ToastLineChart as ToastLineChartWidget } from "shared/chart";

export default function RevenueNegativeDipsToastLine() {
  return (
    <Widget
      widget={ToastLineChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            { legend: "Net Revenue ($K)", values: [12, -8, 24, -15, 32, -5, 18, 28] },
            { legend: "Operating Cash", values: [5, -12, 8, -20, 15, -3, 10, 22] },
          ],
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }) => {
            const value = parseFloat(name);
            const isNegative = value < 0;
            const isZero = value === 0;
            return Text(name, {
              style: new TextStyle({
                fontSize: 11,
                color: isZero ? "#64748b" : isNegative ? "#dc2626" : "#16a34a",
                fontWeight: isZero ? "bold" : isNegative ? "600" : undefined,
              }),
            });
          },
        },
        config: {
          colors: ["#2563eb", "#f97316"],
          line: {
            strokeWidth: 2.5,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
