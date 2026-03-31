"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Transform, Text, TextStyle, Alignment } from "flitter-ui";

export default function WeeklySalesTrackerToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          datasets: [{ legend: "Units Sold", values: [64, 82, 75, 93, 110, 142, 98] }],
        },
        config: {
          colors: ["#6366f1"],
          title: { text: "Weekly Sales Tracker", visible: true },
          bar: { cornerRadius: 2 },
        },
        custom: {
          xAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            return Transform.rotate({
              angle: -Math.PI / 4,
              alignment: Alignment.centerRight,
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 10,
                  color: "#64748b",
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
