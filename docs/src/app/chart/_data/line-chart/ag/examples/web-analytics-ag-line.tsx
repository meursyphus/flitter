"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export default function WebAnalyticsAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Pageviews (K)", values: [320, 345, 380, 410, 395, 430, 465, 490, 475, 510, 540, 580] },
            { legend: "Sessions (K)", values: [180, 195, 215, 230, 220, 245, 260, 275, 265, 290, 305, 325] },
            { legend: "Bounce Rate (%)", values: [42, 40, 38, 36, 37, 34, 32, 30, 31, 29, 28, 26] },
          ],
        },
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#a855f7"], strokes: ["#0ea5e9", "#f97316", "#a855f7"] },
          legend: { position: "right-top" },
          line: {
            strokeWidth: 2,
            spline: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
