"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";

export default function NetworkTrafficToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
          datasets: [
            { legend: "Inbound (Gbps)", values: [2.1, 0.8, 1.8, 6.2, 8.1, 5.2] },
            { legend: "Outbound (Gbps)", values: [1.8, 0.5, 1.5, 5.5, 7.2, 4.5] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#f97316"],
          area: {
            strokeWidth: 1.5,
            opacity: 0.15,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
