"use client";

import { BoxPlotChart } from "@/lib/charts";

export const galleryTitle = "API Latency Distribution (ms)";

export function createWidget() {
  return BoxPlotChart({
    data: {
      labels: ["Search", "Catalog", "Checkout", "Billing"],
      datasets: [
        {
          legend: "Baseline",
          data: [
            {
              min: 60,
              q1: 80,
              median: 95,
              q3: 120,
              max: 150,
              outliers: [195],
            },
            {
              min: 35,
              q1: 48,
              median: 60,
              q3: 76,
              max: 90,
            },
            {
              min: 120,
              q1: 160,
              median: 195,
              q3: 235,
              max: 280,
              outliers: [340],
            },
            {
              min: 70,
              q1: 95,
              median: 110,
              q3: 145,
              max: 175,
            },
          ],
        },
        {
          legend: "Peak traffic",
          data: [
            {
              min: 85,
              q1: 110,
              median: 138,
              q3: 170,
              max: 210,
            },
            {
              min: 45,
              q1: 60,
              median: 75,
              q3: 95,
              max: 120,
            },
            {
              min: 155,
              q1: 195,
              median: 230,
              q3: 280,
              max: 330,
              outliers: [390],
            },
            {
              min: 90,
              q1: 115,
              median: 140,
              q3: 175,
              max: 210,
            },
          ],
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
