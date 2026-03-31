"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius } from "flitter-ui";

export default function EmployeeDistributionToast() {
  const datasets = [
    { legend: "Junior", values: [45, 20, 25, 30, 12, 8] },
    { legend: "Mid-Level", values: [60, 25, 30, 20, 15, 12] },
    { legend: "Senior", values: [35, 15, 20, 10, 8, 10] },
  ];
  const labels = ["Engineering", "Marketing", "Sales", "Support", "Design", "Product"];

  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "horizontal",
        data: { labels, datasets },
        config: {
          colors: ["#3b82f6", "#f59e0b", "#ef4444"],
          bar: { gap: 1 },
          title: { text: "Employee Distribution", visible: true },
        },
        custom: {
          bar: (
            { value, legend, label }: { value: number; legend: string; label: string },
            context: any,
          ) => {
            const labelIdx = labels.indexOf(label);
            const total = datasets.reduce((sum, ds) => sum + ds.values[labelIdx], 0);
            const colorMap: Record<string, string> = {
              Junior: "#3b82f6",
              "Mid-Level": "#f59e0b",
              Senior: "#ef4444",
            };
            const baseColor = colorMap[legend] ?? "#3b82f6";
            const isLargeDept = total >= 100;
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: isLargeDept ? baseColor : `${baseColor}88`,
                borderRadius: BorderRadius.circular(2),
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
