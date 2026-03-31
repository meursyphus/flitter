"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function WeeklySalesTrackerToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ legend: "Units Sold", values: [64, 82, 75, 93, 110, 142, 98] }],
        },
        config: { colors: ["#6366f1"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
