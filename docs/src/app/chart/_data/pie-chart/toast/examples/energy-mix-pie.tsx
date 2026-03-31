"use client";

import Widget from "@flitterjs/react";
import { ToastPieChart } from "shared/chart";

export default function EnergyMixPie() {
  return (
    <Widget
      widget={ToastPieChart({
        data: {
          datasets: [
            { name: "Coal", value: 27 },
            { name: "Natural Gas", value: 24 },
            { name: "Nuclear", value: 10 },
            { name: "Solar", value: 15 },
            { name: "Wind", value: 13 },
            { name: "Hydro", value: 11 },
          ],
        },
        config: {
          colors: ["#78716c", "#64748b", "#a855f7", "#eab308", "#22c55e", "#06b6d4"],
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
