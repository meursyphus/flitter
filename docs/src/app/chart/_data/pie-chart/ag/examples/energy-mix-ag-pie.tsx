"use client";

import Widget from "@flitterjs/react";
import { PieChart } from "shared/chart";

export default function EnergyMixAgPie() {
  return (
    <Widget
      widget={PieChart({
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
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
