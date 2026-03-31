"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function MarketShareAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Apple", value: 28 },
            { name: "Samsung", value: 22 },
            { name: "Xiaomi", value: 13 },
            { name: "Oppo", value: 9 },
            { name: "Vivo", value: 8 },
            { name: "Others", value: 20 },
          ],
        },
        config: {
          colors: { fills: ["#1d4ed8", "#0f766e", "#ea580c", "#7c3aed", "#dc2626", "#64748b"] },
          pie: {
            strokeWidth: 4,
            strokeColor: "#f8fafc",
          },
          dataLabel: {
            visible: true,
            fontSize: 13,
            fontColor: "#334155",
            fontWeight: "600",
            formatter: ({ name, percentage }: any) =>
              `${name} (${percentage.toFixed(0)}%)`,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
