"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

export default function HorizontalCategoryToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["Tokyo", "London", "New York", "Berlin", "Sydney", "Toronto", "Singapore"],
          datasets: [
            { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
            { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
            { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
          ],
        },
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b"],
          title: { text: "Office Revenue by Region", visible: true },
        },
        custom: {
          yAxisLabel: (
            { name, index }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const medals = ["#c9a227", "#8a8a8a", "#b87333"];
            const isMedal = index < 3;
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(`${index + 1}`, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: 10,
                    fontWeight: "bold",
                    color: isMedal ? medals[index] : "#94a3b8",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    fontWeight: isMedal ? "bold" : "normal",
                    color: isMedal ? "#1e293b" : "#64748b",
                  }),
                }),
              ],
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
