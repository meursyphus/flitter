"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function RevenueGrowthToastArea() {
  const revenueValues = [4.2, 4.8, 5.1, 5.9, 6.3, 7.0, 7.5, 8.2];
  const costValues = [3.1, 3.4, 3.6, 3.8, 4.0, 4.2, 4.3, 4.5];
  const totalPoints = revenueValues.length;

  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
          datasets: [
            { legend: "Revenue ($M)", values: revenueValues },
            { legend: "Costs ($M)", values: costValues },
          ],
        },
        config: {
          colors: ["#10b981", "#f43f5e"],
          title: { text: "Revenue vs Costs", visible: true },
          area: {
            strokeWidth: 2,
            opacity: 0.4,
            spline: false,
          },
        },
        custom: {
          dataLabel: (
            { value, label, legend }: { value: number; label: string; legend: string },
            context: any,
          ) => {
            const labels = context.data?.labels ?? [];
            const isLast = label === labels[labels.length - 1];
            if (!isLast) return Text("", { style: new TextStyle({}) });
            return Text(`$${value}M`, {
              style: new TextStyle({
                fontSize: 10,
                fontWeight: "700",
                color: legend === "Revenue ($M)" ? "#10b981" : "#f43f5e",
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
