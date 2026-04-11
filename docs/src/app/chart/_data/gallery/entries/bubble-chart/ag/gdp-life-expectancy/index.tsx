"use client";

export const galleryTitle = "GDP vs Life Expectancy";

import Widget from "@flitterjs/react";
import { BubbleChart } from "shared/chart";

export function createWidget() {
  return BubbleChart({
    data: {
      datasets: [
        {
          legend: "Asia",
          data: [
            { x: 75, y: 82, value: 62, label: "China" },
            { x: 42, y: 74, value: 55, label: "India" },
            { x: 18, y: 68, value: 45, label: "Indonesia" },
            { x: 55, y: 78, value: 38, label: "Japan" },
            { x: 30, y: 71, value: 50, label: "Pakistan" },
            { x: 85, y: 84, value: 25, label: "S. Korea" },
            { x: 12, y: 65, value: 42, label: "Bangladesh" },
            { x: 48, y: 76, value: 35, label: "Thailand" },
            { x: 22, y: 70, value: 30, label: "Vietnam" },
          ],
        },
        {
          legend: "Europe",
          data: [
            { x: 52, y: 81, value: 48, label: "Germany" },
            { x: 45, y: 82, value: 40, label: "France" },
            { x: 60, y: 80, value: 35, label: "UK" },
            { x: 38, y: 83, value: 28, label: "Italy" },
            { x: 68, y: 81, value: 20, label: "Netherlands" },
            { x: 55, y: 79, value: 45, label: "Russia" },
            { x: 72, y: 82, value: 22, label: "Switzerland" },
            { x: 48, y: 80, value: 32, label: "Poland" },
            { x: 35, y: 78, value: 25, label: "Spain" },
          ],
        },
        {
          legend: "Americas",
          data: [
            { x: 65, y: 78, value: 60, label: "USA" },
            { x: 50, y: 81, value: 30, label: "Canada" },
            { x: 10, y: 72, value: 52, label: "Brazil" },
            { x: 15, y: 75, value: 35, label: "Mexico" },
            { x: 8, y: 74, value: 45, label: "Colombia" },
            { x: 20, y: 77, value: 18, label: "Chile" },
            { x: 12, y: 73, value: 40, label: "Argentina" },
            { x: 25, y: 76, value: 22, label: "Peru" },
          ],
        },
        {
          legend: "Africa",
          data: [
            { x: 6, y: 55, value: 58, label: "Nigeria" },
            { x: 8, y: 64, value: 42, label: "Ethiopia" },
            { x: 4, y: 62, value: 50, label: "Congo" },
            { x: 3, y: 58, value: 38, label: "Tanzania" },
            { x: 5, y: 72, value: 28, label: "S. Africa" },
            { x: 2, y: 60, value: 45, label: "Kenya" },
            { x: 7, y: 66, value: 22, label: "Uganda" },
            { x: 10, y: 68, value: 35, label: "Ghana" },
          ],
        },
      ],
    },
    config: {
      title: { text: "GDP per Capita vs Life Expectancy", visible: true },
      subtitle: {
        text: "Bubble size = population (millions) · by continent",
        visible: true,
      },
    },
  });
}

export default function BubbleChartAgGdpLifeExpectancy() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
