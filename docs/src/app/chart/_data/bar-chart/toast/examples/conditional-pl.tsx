"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius, Radius } from "flitter-ui";

export default function ConditionalPLToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { legend: "Net Income ($K)", values: [120, -45, 85, -60, 150, -30] },
          ],
        },
        config: {
          colors: ["#10b981"],
          title: { text: "Monthly P&L", visible: true },
          bar: { cornerRadius: 3 },
        },
        custom: {
          bar: (
            { value }: { value: number },
            context: any,
          ) => {
            const { bar } = context.config;
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: value >= 0 ? "#10b981" : "#ef4444",
                borderRadius: BorderRadius.circular(bar.cornerRadius),
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
