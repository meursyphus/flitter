"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function UserEngagementToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          datasets: [
            { legend: "DAU (K)", values: [12, 15, 22, 28, 27, 35] },
            { legend: "WAU (K)", values: [45, 55, 70, 85, 82, 102] },
            { legend: "MAU (K)", values: [120, 140, 175, 210, 215, 260] },
          ],
        },
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b"],
          title: { text: "User Engagement", visible: true },
          area: {
            strokeWidth: 2.5,
            opacity: 0.25,
            spline: false,
          },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }) => {
            const value = parseFloat(name);
            return Text(value >= 1000 ? `${(value / 1000).toFixed(0)}K` : name, {
              style: new TextStyle({
                fontSize: 11,
                color: value >= 200 ? "#6366f1" : "#94a3b8",
                fontWeight: value >= 200 ? "600" : undefined,
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
