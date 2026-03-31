"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export default function YearOverYearAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { legend: "2024", values: [340, 380, 420, 395, 450, 470] },
            { legend: "2025", values: [410, 445, 480, 460, 520, 540] },
          ],
        },
        config: {
          colors: { fills: ["#64748b", "#0d9488"] },
          bar: { cornerRadius: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
