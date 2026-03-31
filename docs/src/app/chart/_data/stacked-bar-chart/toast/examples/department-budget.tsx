"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Transform, Text, TextStyle, Alignment } from "flitter-ui";

export default function DepartmentBudgetToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Product", "Engineering", "Design", "Marketing", "Sales"],
          datasets: [
            { legend: "Salaries", values: [280, 520, 180, 210, 260] },
            { legend: "Tools & Infra", values: [45, 190, 60, 85, 40] },
            { legend: "Training", values: [30, 55, 35, 25, 45] },
            { legend: "Travel", values: [20, 15, 10, 65, 80] },
          ],
        },
        config: {
          colors: ["#6366f1", "#a78bfa", "#c4b5fd", "#ddd6fe"],
          title: { text: "Department Budget ($K)", visible: true },
        },
        custom: {
          xAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            return Transform.rotate({
              angle: -Math.PI / 6,
              alignment: Alignment.centerRight,
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 10,
                  fontWeight: "600",
                  color: "#4338ca",
                }),
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
