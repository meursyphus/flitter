"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function DevicePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Desktop", value: 52 },
            { name: "Mobile", value: 38 },
            { name: "Tablet", value: 10 },
          ],
        },
        config: {
          colors: ["#6366f1", "#06b6d4", "#f59e0b"],
          pie: {
            innerRadiusRatio: 0.5,
            strokeWidth: 4,
            strokeColor: "white",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
