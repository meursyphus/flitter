"use client";

import { BulletChart } from "@/lib/charts";

export const galleryTitle = "Revenue Against Target ($M)";

export function createWidget() {
  return BulletChart({
    data: {
      labels: ["Americas", "Europe", "Asia Pacific", "Other"],
      datasets: [
        {
          value: 118,
          target: 110,
          ranges: [65, 95, 130],
        },
        {
          value: 92,
          target: 100,
          ranges: [50, 80, 115],
        },
        {
          value: 104,
          target: 100,
          ranges: [60, 85, 120],
        },
        {
          value: 48,
          target: 55,
          ranges: [25, 40, 65],
        },
      ],
    },
    direction: "horizontal",
    config: { title: { text: galleryTitle, visible: true } },
  });
}
