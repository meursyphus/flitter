"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

export default function CashFlowToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            { legend: "Operating", values: [120, -45, 80, -30, 150, -60, 95, 200] },
            { legend: "Net P&L", values: [60, -90, 25, -55, 70, -110, 40, 130] },
          ],
        },
        config: {
          colors: ["#10b981", "#ef4444"],
          area: {
            strokeWidth: 2,
            opacity: 0.3,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
