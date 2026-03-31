"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

export default function DarkMonitoringAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
          datasets: [
            { legend: "Inbound (Gbps)", values: [1.2, 0.4, 3.8, 6.5, 5.1, 2.8] },
            { legend: "Outbound (Gbps)", values: [0.9, 0.3, 2.5, 4.8, 3.9, 2.1] },
            { legend: "Errors (K)", values: [0.1, 0.05, 0.3, 0.8, 0.6, 0.2] },
          ],
        },
        config: {
          colors: { fills: ["#22d3ee", "#a78bfa", "#f87171"], strokes: ["#22d3ee", "#a78bfa", "#f87171"] },
          background: "#111827",
          grid: { dash: [4, 4], color: "rgba(255,255,255,0.1)" },
          axis: { color: "rgba(255,255,255,0.3)", label: { color: "rgba(255,255,255,0.6)" } },
          legend: { color: "rgba(255,255,255,0.7)" },
          area: {
            strokeWidth: 1.5,
            opacity: 0.2,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
