"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function PopulationByAgeToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "horizontal",
        data: {
          labels: ["0-14", "15-24", "25-34", "35-44", "45-54", "55-64", "65+"],
          datasets: [
            { legend: "Male (M)", values: [9.8, 8.2, 11.4, 10.6, 9.1, 7.8, 6.5] },
            { legend: "Female (M)", values: [9.3, 7.9, 11.1, 10.9, 9.4, 8.1, 7.2] },
          ],
        },
        config: { colors: ["#3b82f6", "#ec4899"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
