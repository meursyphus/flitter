"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function TimeAllocationPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Meetings", value: 25 },
            { name: "Coding", value: 35 },
            { name: "Code Review", value: 15 },
            { name: "Planning", value: 15 },
            { name: "Break", value: 10 },
          ],
        },
        config: {
          colors: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
          pie: {
            innerRadiusRatio: 0.45,
            strokeWidth: 3,
            strokeColor: "#f5f5f5",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
