"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function PopulationByAgeToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: [
            "Under\n14",
            "15 to\n24",
            "25 to\n34",
            "35 to\n44",
            "45 to\n54",
            "55 to\n64",
            "Over\n65",
          ],
          datasets: [
            { legend: "Male (M)", values: [9.8, 8.2, 11.4, 10.6, 9.1, 7.8, 6.5] },
            { legend: "Female (M)", values: [9.3, 7.9, 11.1, 10.9, 9.4, 8.1, 7.2] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#ec4899"],
          title: { text: "Population Distribution by Age", visible: true },
          legend: { position: "right-center" },
          bar: { cornerRadius: 2 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
