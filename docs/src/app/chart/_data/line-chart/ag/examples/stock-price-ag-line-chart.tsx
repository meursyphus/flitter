"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export default function StockPriceAgLineChart() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "AAPL", values: [185, 190, 178, 195, 188, 210, 225, 218, 230, 222, 240, 248] },
            { legend: "GOOGL", values: [140, 145, 138, 150, 155, 162, 158, 170, 175, 168, 180, 188] },
            { legend: "MSFT", values: [375, 382, 370, 390, 398, 410, 420, 415, 430, 425, 440, 455] },
          ],
        },
        config: {
          colors: { fills: ["#2563eb", "#dc2626", "#059669"], strokes: ["#2563eb", "#dc2626", "#059669"] },
          background: "#fafafa",
          grid: { dash: [2, 2] },
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
