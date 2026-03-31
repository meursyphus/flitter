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
        config: {
          colors: { fills: ["#78716c", "#64748b", "#a855f7", "#eab308", "#22c55e", "#06b6d4"] },
          title: {
            text: "Global Energy Mix",
            visible: true,
            alignment: "start",
          },
          dataLabel: {
            visible: true,
            fontSize: 13,
            fontColor: "#475569",
            formatter: ({ name, value }: any) =>
              `${name}: ${value}%`,
          },
          legend: {
            visible: false,
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
