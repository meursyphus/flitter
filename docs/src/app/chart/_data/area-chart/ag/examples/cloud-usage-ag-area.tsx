"use client";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function CloudUsageAgArea() {
  return (
    <Widget
      widget={AreaChart({
        data: {
          labels: ["Jan\nQ1", "Mar\nQ1", "May\nQ2", "Jul\nQ3", "Sep\nQ3", "Nov\nQ4"],
          datasets: [
            { legend: "Compute ($K)", values: [12.5, 14.8, 18.5, 23.4, 24.2, 19.5] },
            { legend: "Storage ($K)", values: [5.2, 5.9, 7.0, 8.2, 9.2, 10.0] },
            { legend: "Network ($K)", values: [3.1, 3.8, 4.9, 6.5, 6.8, 5.0] },
          ],
        },
        config: {
          colors: { fills: ["#3b82f6", "#f59e0b", "#10b981"], strokes: ["#3b82f6", "#f59e0b", "#10b981"] },
          background: "#f8fafc",
          area: {
            strokeWidth: 2,
            opacity: 0.25,
            spline: false,
          },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }) => {
            const value = parseFloat(name);
            return Text(isNaN(value) ? name : `$${name}K`, {
              style: new TextStyle({
                fontSize: 11,
                color: "#64748b",
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
