"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

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
        config: { colors: ["#f59e0b"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
