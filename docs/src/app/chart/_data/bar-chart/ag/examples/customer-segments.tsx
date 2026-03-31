"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";

export default function CustomerSegmentsAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Enterprise", "Mid-Market", "SMB", "Startup"],
          datasets: [
            { legend: "New ARR ($K)", values: [480, 320, 190, 85] },
            { legend: "Expansion ($K)", values: [210, 145, 70, 32] },
            { legend: "Churn ($K)", values: [-95, -68, -42, -28] },
          ],
        },
        config: {
          colors: { fills: ["#10b981", "#3b82f6", "#ef4444"] },
          bar: { cornerRadius: 4 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
