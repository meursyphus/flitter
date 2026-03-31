"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

export default function RevenueGrowthToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
          datasets: [
            { legend: "Revenue ($M)", values: [4.2, 4.8, 5.1, 5.9, 6.3, 7.0, 7.5, 8.2] },
            { legend: "Costs ($M)", values: [3.1, 3.4, 3.6, 3.8, 4.0, 4.2, 4.3, 4.5] },
          ],
        },
        config: {
          colors: ["#10b981", "#f43f5e"],
          area: {
            strokeWidth: 2,
            opacity: 0.4,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
