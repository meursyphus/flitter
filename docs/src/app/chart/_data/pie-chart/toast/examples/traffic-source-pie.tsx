"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function TrafficSourcePie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Organic", value: 38 },
            { name: "Direct", value: 22 },
            { name: "Social", value: 18 },
            { name: "Referral", value: 14 },
            { name: "Email", value: 8 },
          ],
        },
        config: {
          colors: ["#3b82f6", "#10b981", "#f97316", "#ec4899", "#6366f1"],
          pie: {
            innerRadiusRatio: 0.55,
          },
          title: {
            text: "Traffic Sources — Q4 2025",
            visible: true,
            fontSize: 14,
            fontWeight: "600",
            color: "#1e293b",
            position: "top",
            alignment: "center",
          },
          legend: {
            position: "bottom",
            gap: 16,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
