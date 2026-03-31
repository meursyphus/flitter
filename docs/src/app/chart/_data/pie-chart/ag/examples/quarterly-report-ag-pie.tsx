"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function QuarterlyReportAgPie() {
  return (
    <Widget
      widget={PieChart({
        data: {
          datasets: [
            { name: "Product Sales", value: 48 },
            { name: "Subscriptions", value: 24 },
            { name: "Licensing", value: 14 },
            { name: "Consulting", value: 9 },
            { name: "Support", value: 5 },
          ],
        },
        config: {
          title: {
            text: "Revenue Split",
            visible: true,
            alignment: "center",
          },
          subtitle: {
            text: "FY 2025 Q4",
            visible: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
