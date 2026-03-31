"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function BasicAgPieChart() {
  return (
    <Widget
      widget={PieChart({
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
          title: {
            text: "Browser Market Share",
            visible: true,
            alignment: "center",
          },
          subtitle: {
            text: "2025 Global Desktop Usage",
            visible: true,
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
