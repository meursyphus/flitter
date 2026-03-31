"use client";

import Widget from "@flitterjs/react";
import { BubbleChart } from "shared/chart";

export default function SmallAgBubbleChart() {
  return (
    <Widget
      widget={BubbleChart({
        data: {
          datasets: [
            {
              legend: "Africa",
              data: [
                { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
                { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
                { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 5600, y: 71.96, value: 92988000, label: "China" },
                { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
                { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
                { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
                { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
              ],
            },
          ],
        },
        config: {
          bubble: { minRadius: 2, maxRadius: 20, opacity: 0.8 },
          colors: {
            fills: ["#7c3aed", "#06b6d4", "#f97316"],
            strokes: ["#7c3aed", "#06b6d4", "#f97316"],
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
