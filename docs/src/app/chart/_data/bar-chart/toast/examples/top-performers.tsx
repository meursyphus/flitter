"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function TopPerformersToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Alice", "Bob", "Carol", "Dave", "Eve"],
          datasets: [{ legend: "Sales ($K)", values: [142, 128, 115, 98, 87] }],
        },
        config: { colors: ["#f97316"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
