"use client";

export const galleryTitle = "GDP per Capita vs Life Expectancy";

import Widget from "@flitterjs/react";
import { BubbleChart } from "shared/chart";

export function createWidget() {
  return BubbleChart({
        data: {
          datasets: [
            {
              legend: "North America",
              data: [
                { x: 62000, y: 78.5, value: 331000000, label: "USA" },
                { x: 48000, y: 82.3, value: 38000000, label: "Canada" },
                { x: 19000, y: 75.1, value: 128000000, label: "Mexico" },
              ],
            },
            {
              legend: "Europe",
              data: [
                { x: 46000, y: 81.2, value: 83000000, label: "Germany" },
                { x: 42000, y: 82.7, value: 67000000, label: "France" },
                { x: 34000, y: 83.5, value: 60000000, label: "Italy" },
                { x: 41000, y: 81.3, value: 67000000, label: "UK" },
              ],
            },
            {
              legend: "Asia",
              data: [
                { x: 40000, y: 84.6, value: 126000000, label: "Japan" },
                { x: 31000, y: 83.4, value: 52000000, label: "South Korea" },
                { x: 12000, y: 77.3, value: 1400000000, label: "China" },
              ],
            },
          ],
        },
        config: {
          title: { text: "GDP per Capita vs Life Expectancy", visible: true },
        },
      });
}

export default function BubbleChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
