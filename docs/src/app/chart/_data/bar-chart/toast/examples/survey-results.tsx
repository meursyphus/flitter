"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius } from "flitter-ui";

export default function SurveyResultsToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "horizontal",
        data: {
          labels: [
            "Ease of Use",
            "Performance",
            "Documentation",
            "Design Quality",
            "Support",
            "Value for Money",
          ],
          datasets: [{ legend: "Score (%)", values: [92, 87, 78, 95, 71, 84] }],
        },
        config: {
          colors: ["#f59e0b"],
          title: { text: "User Satisfaction Survey", visible: true },
          bar: { cornerRadius: 32 },
        },
        custom: {
          bar: (
            { value }: { value: number },
            context: any,
          ) => {
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: value >= 90 ? "#10b981" : value >= 80 ? "#f59e0b" : "#94a3b8",
                borderRadius: BorderRadius.circular(8),
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
