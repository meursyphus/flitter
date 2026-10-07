"use client";

import { HistogramChart } from "@/lib/charts";

export const galleryTitle = "Parcel Weight Distribution (kg)";

export function createWidget() {
  return HistogramChart({
    data: {
      rows: [
        {
          weight: 0.4,
        },
        {
          weight: 0.6,
        },
        {
          weight: 0.7,
        },
        {
          weight: 0.8,
        },
        {
          weight: 0.9,
        },
        {
          weight: 1,
        },
        {
          weight: 1.1,
        },
        {
          weight: 1.2,
        },
        {
          weight: 1.3,
        },
        {
          weight: 1.3,
        },
        {
          weight: 1.4,
        },
        {
          weight: 1.5,
        },
        {
          weight: 1.5,
        },
        {
          weight: 1.6,
        },
        {
          weight: 1.6,
        },
        {
          weight: 1.7,
        },
        {
          weight: 1.8,
        },
        {
          weight: 1.8,
        },
        {
          weight: 1.9,
        },
        {
          weight: 2,
        },
        {
          weight: 2,
        },
        {
          weight: 2.1,
        },
        {
          weight: 2.2,
        },
        {
          weight: 2.2,
        },
        {
          weight: 2.3,
        },
        {
          weight: 2.4,
        },
        {
          weight: 2.4,
        },
        {
          weight: 2.5,
        },
        {
          weight: 2.6,
        },
        {
          weight: 2.8,
        },
        {
          weight: 2.9,
        },
        {
          weight: 3,
        },
        {
          weight: 3.2,
        },
        {
          weight: 3.4,
        },
        {
          weight: 3.8,
        },
        {
          weight: 4.1,
        },
      ],
      xKey: "weight",
    },
    transform: { binCount: 8, aggregation: "count" },
    config: { title: { text: galleryTitle, visible: true } },
  });
}
