"use client";

export const galleryTitle = "Product Revenue vs Margin";

import Widget from "@flitterjs/react";
import { ToastBubbleChart } from "shared/chart";

export function createWidget() {
  return ToastBubbleChart({
    data: {
      datasets: [
        {
          legend: "Asia",
          data: [
            { x: 82, y: 45, value: 55, label: "China" },
            { x: 68, y: 58, value: 40, label: "India" },
            { x: 55, y: 35, value: 62, label: "Japan" },
            { x: 40, y: 68, value: 30, label: "S. Korea" },
            { x: 75, y: 52, value: 48, label: "Indonesia" },
            { x: 28, y: 42, value: 35, label: "Thailand" },
            { x: 62, y: 72, value: 25, label: "Vietnam" },
          ],
        },
        {
          legend: "Europe",
          data: [
            { x: 35, y: 78, value: 42, label: "Germany" },
            { x: 48, y: 65, value: 55, label: "France" },
            { x: 22, y: 82, value: 30, label: "UK" },
            { x: 58, y: 48, value: 38, label: "Italy" },
            { x: 42, y: 72, value: 20, label: "Spain" },
            { x: 15, y: 55, value: 45, label: "Poland" },
            { x: 52, y: 60, value: 28, label: "Netherlands" },
          ],
        },
        {
          legend: "Americas",
          data: [
            { x: 88, y: 32, value: 65, label: "USA" },
            { x: 72, y: 42, value: 50, label: "Canada" },
            { x: 45, y: 25, value: 58, label: "Brazil" },
            { x: 60, y: 38, value: 42, label: "Mexico" },
            { x: 32, y: 55, value: 35, label: "Argentina" },
            { x: 78, y: 28, value: 48, label: "Chile" },
          ],
        },
        {
          legend: "Oceania",
          data: [
            { x: 50, y: 85, value: 20, label: "Australia" },
            { x: 65, y: 75, value: 32, label: "N. Zealand" },
            { x: 38, y: 62, value: 28, label: "Fiji" },
            { x: 72, y: 68, value: 18, label: "Papua N.G." },
            { x: 45, y: 80, value: 24, label: "Samoa" },
          ],
        },
      ],
    },
    config: {
      title: { text: "Product Revenue vs Profit Margin", visible: true },
    },
  });
}

export default function BubbleChartToastProductMargin() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
