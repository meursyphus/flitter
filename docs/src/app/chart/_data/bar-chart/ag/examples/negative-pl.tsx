"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export default function NegativePLAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
          datasets: [
            {
              legend: "Monthly P&L ($K)",
              values: [120, -45, 85, -20, 150, -80, 65, 110],
            },
          ],
        },
        config: {
          colors: { fills: ["#6366f1"] },
          bar: { cornerRadius: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
