"use client";

import { ToastBulletChart } from "@/lib/charts";

export const galleryTitle = "Service Quality Against Target (%)";

export function createWidget() {
  return ToastBulletChart({
    data: {
      labels: ["Chat", "Email", "Phone", "Self-service"],
      datasets: [
        {
          value: 94,
          target: 95,
          ranges: [70, 85, 100],
        },
        {
          value: 88,
          target: 90,
          ranges: [70, 85, 100],
        },
        {
          value: 97,
          target: 95,
          ranges: [70, 85, 100],
        },
        {
          value: 82,
          target: 90,
          ranges: [70, 85, 100],
        },
      ],
    },
    direction: "horizontal",
    config: { title: { text: galleryTitle, visible: true } },
  });
}
