"use client";

import Widget from "@flitterjs/react";
import { BubbleChart } from "flitter-chart";

const defaultData = {
  datasets: [
    {
      legend: "Africa",
      data: [
        { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
        { x: 4200, y: 70.71, value: 76117421, label: "Egypt" },
        { x: 5900, y: 56.46, value: 1355246, label: "Gabon" },
        { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
        { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
        { x: 12800, y: 72.09, value: 1220481, label: "Mauritius" },
        { x: 18200, y: 78.68, value: 396851, label: "Malta" },
      ],
    },
    {
      legend: "America",
      data: [
        { x: 4800, y: 74.64, value: 6191368, label: "Paraguay" },
        { x: 5600, y: 69.22, value: 2754430, label: "Peru" },
        { x: 6600, y: 71.43, value: 4231077, label: "Colombia" },
        { x: 8100, y: 71.41, value: 78410118, label: "Brazil" },
        { x: 9600, y: 74.94, value: 4495959, label: "Mexico" },
        { x: 12400, y: 75.7, value: 6914475, label: "Argentina" },
        { x: 31500, y: 79.96, value: 32507874, label: "Canada" },
        { x: 32100, y: 77.43, value: 89302754, label: "United States" },
      ],
    },
    {
      legend: "Asia",
      data: [
        { x: 5600, y: 71.96, value: 92988000, label: "China" },
        { x: 8100, y: 71.41, value: 14865523, label: "Thailand" },
        { x: 9700, y: 71.95, value: 23522482, label: "Malaysia" },
        { x: 12000, y: 75.23, value: 25795938, label: "Saudi Arabia" },
        { x: 19200, y: 75.58, value: 48598170, label: "Korea, South" },
        { x: 25300, y: 77.06, value: 22749838, label: "Taiwan" },
        { x: 27800, y: 81.53, value: 4353893, label: "Singapore" },
        { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
        { x: 34200, y: 81.39, value: 6855125, label: "Hong Kong" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 9800, y: 66.39, value: 54378233, label: "Russia" },
        { x: 12000, y: 74.16, value: 38626349, label: "Poland" },
        { x: 23300, y: 79.37, value: 40280780, label: "Spain" },
        { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
        { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
        { x: 28700, y: 79.44, value: 30424213, label: "France" },
        { x: 29600, y: 78.27, value: 60270708, label: "United Kingdom" },
        { x: 33800, y: 80.31, value: 7450867, label: "Switzerland" },
      ],
    },
    {
      legend: "Oceania",
      data: [
        { x: 2200, y: 64.56, value: 5420280, label: "Papua New Guinea" },
        { x: 5900, y: 69.2, value: 880874, label: "Fiji" },
        { x: 23200, y: 78.49, value: 1993817, label: "New Zealand" },
        { x: 30700, y: 80.26, value: 5991314, label: "Australia" },
      ],
    },
  ],
};

export function DefaultAgBubbleChart() {
  return (
    <Widget
      widget={BubbleChart({
        style: "ag",
        data: defaultData,
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}

export function SmallAgBubbleChart() {
  return (
    <Widget
      widget={BubbleChart({
        style: "ag",
        data: defaultData,
        config: {
          bubble: { minRadius: 2, maxRadius: 20, opacity: 0.8 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
