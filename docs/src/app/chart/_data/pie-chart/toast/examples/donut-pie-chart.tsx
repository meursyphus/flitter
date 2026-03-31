"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function DonutPieChart() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Chrome", value: 65 },
            { name: "Safari", value: 18 },
            { name: "Firefox", value: 8 },
            { name: "Edge", value: 5 },
            { name: "Other", value: 4 },
          ],
        },
        config: {
          colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"],
          pie: {
            innerRadiusRatio: 0.5,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
