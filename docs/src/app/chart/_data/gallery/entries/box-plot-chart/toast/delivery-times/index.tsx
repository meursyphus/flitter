"use client";

import { ToastBoxPlotChart } from "@/lib/charts";

export const galleryTitle = "Delivery Times by Region (days)";

export function createWidget() {
  return ToastBoxPlotChart({
    data: {
      labels: ["North", "South", "East", "West"],
      datasets: [
        {
          legend: "Standard",
          data: [
            {
              min: 2,
              q1: 3,
              median: 4,
              q3: 5,
              max: 7,
              outliers: [9],
            },
            {
              min: 3,
              q1: 4,
              median: 5,
              q3: 6,
              max: 8,
            },
            {
              min: 2,
              q1: 3,
              median: 3.5,
              q3: 4.5,
              max: 6,
            },
            {
              min: 3,
              q1: 4,
              median: 5,
              q3: 7,
              max: 9,
            },
          ],
        },
        {
          legend: "Express",
          data: [
            {
              min: 1,
              q1: 1.5,
              median: 2,
              q3: 2.5,
              max: 3.5,
            },
            {
              min: 1,
              q1: 2,
              median: 2.5,
              q3: 3,
              max: 4,
            },
            {
              min: 0.5,
              q1: 1,
              median: 1.5,
              q3: 2,
              max: 3,
            },
            {
              min: 1,
              q1: 1.5,
              median: 2,
              q3: 3,
              max: 4,
              outliers: [5.5],
            },
          ],
        },
      ],
    },
    direction: "horizontal",
    config: { title: { text: galleryTitle, visible: true } },
  });
}
