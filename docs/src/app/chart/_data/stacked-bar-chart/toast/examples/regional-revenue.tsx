"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Container, BoxDecoration, BorderRadius, EdgeInsets, Radius } from "flitter-ui";

export default function RegionalRevenueToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
            { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
            { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
          ],
        },
        config: {
          colors: ["#6366f1", "#a78bfa", "#c4b5fd"],
          bar: { gap: 2 },
          title: { text: "Regional Revenue", visible: true },
        },
        custom: {
          bar: (
            { value, legend }: { value: number; legend: string },
            context: any,
          ) => {
            const colorMap: Record<string, string> = {
              "North America": "#6366f1",
              "Europe": "#a78bfa",
              "Asia Pacific": "#c4b5fd",
            };
            const isTopSegment = legend === "Asia Pacific";
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: colorMap[legend] ?? "#6366f1",
                borderRadius: isTopSegment
                  ? BorderRadius.only({
                      topLeft: Radius.circular(6),
                      topRight: Radius.circular(6),
                    })
                  : BorderRadius.zero,
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
