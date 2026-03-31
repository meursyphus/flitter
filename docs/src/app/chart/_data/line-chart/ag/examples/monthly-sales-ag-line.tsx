"use client";

import Widget from "@flitterjs/react";
import { LineChart } from "shared/chart";

export default function MonthlySalesAgLine() {
  return (
    <Widget
      widget={LineChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Electronics", values: [95, 88, 102, 110, 98, 115, 128, 135, 120, 140, 165, 190] },
            { legend: "Clothing", values: [65, 58, 72, 80, 85, 90, 78, 70, 88, 95, 110, 130] },
            { legend: "Home & Garden", values: [40, 35, 48, 62, 75, 82, 88, 85, 70, 55, 42, 38] },
          ],
        },
        config: {
          colors: { fills: ["#059669", "#d97706", "#e11d48"], strokes: ["#059669", "#d97706", "#e11d48"] },
          title: { text: "Product Sales by Category", visible: true, alignment: "center" },
          line: {
            strokeWidth: 2.5,
            spline: true,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
