"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets } from "flitter-ui";

export default function ConditionalPLToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [
            { legend: "Net Income ($K)", values: [120, -45, 85, -60] },
          ],
        },
        config: {
          colors: ["#10b981"],
          bar: { cornerRadius: 3 },
        },
        custom: {
          bar: ({ value }) =>
            Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: value >= 0 ? "#10b981" : "#ef4444",
              }),
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
