"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";

export default function CloudCostAgStackedArea() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Compute", values: [4200, 4400, 4600, 4800, 5100, 5400, 5700, 5500, 5800, 6000, 6300, 6600] },
            { legend: "Storage", values: [1800, 1900, 2000, 2100, 2200, 2350, 2500, 2600, 2750, 2900, 3050, 3200] },
            { legend: "Network", values: [900, 950, 1000, 1050, 1100, 1200, 1300, 1250, 1350, 1400, 1500, 1600] },
            { legend: "Database", values: [1500, 1550, 1600, 1650, 1700, 1800, 1900, 1950, 2000, 2100, 2200, 2300] },
          ],
        },
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"], strokes: ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981"] },
          area: { opacity: 0.45 },
          grid: { dash: [4, 4] },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
