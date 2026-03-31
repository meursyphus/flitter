"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function RevenueByRegionPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Americas", value: 42 },
            { name: "EMEA", value: 31 },
            { name: "APAC", value: 22 },
            { name: "Other", value: 5 },
          ],
        },
        config: {
          colors: ["#2563eb", "#dc2626", "#059669", "#d97706"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
