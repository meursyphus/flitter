"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export default function CryptoTrendAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "BTC ($K)", values: [42.5, 44.8, 40.2, 38.5, 36.1, 31.2, 29.8, 24.5, 19.8, 20.5, 16.8, 16.5] },
            { legend: "ETH ($K)", values: [3.2, 3.0, 2.8, 2.9, 2.1, 1.8, 1.6, 1.5, 1.3, 1.4, 1.2, 1.2] },
            { legend: "SOL ($)", values: [170, 105, 95, 100, 50, 38, 35, 33, 32, 30, 14, 12] },
          ],
        },
        config: {
          colors: { fills: ["#f7931a", "#627eea", "#9945ff"], strokes: ["#f7931a", "#627eea", "#9945ff"] },
          background: "#111827",
          title: { color: "#e5e7eb" },
          axis: { label: { color: "#9ca3af" }, color: "#374151" },
          grid: { color: "#1f2937" },
          legend: { color: "#d1d5db" },
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
