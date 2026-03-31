"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function DonutAgPieChart() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Americas", value: 42 },
            { name: "EMEA", value: 31 },
            { name: "APAC", value: 22 },
            { name: "Other", value: 5 },
          ],
        },
        config: {
          colors: { fills: ["#2563eb", "#dc2626", "#059669", "#d97706"] },
          pie: {
            innerRadiusRatio: 0.65,
            strokeWidth: 3,
          },
          title: {
            text: "Revenue by Region",
            visible: true,
            alignment: "center",
          },
          dataLabel: {
            visible: true,
            fontSize: 14,
            fontColor: "#1e293b",
            fontWeight: "bold",
            formatter: ({ name, percentage }: any) =>
              `${percentage.toFixed(0)}%`,
          },
          legend: {
            visible: true,
            position: "bottom",
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
