"use client";

export const galleryTitle = "Transportation Usage by Country";

import { ToastAreaChart } from "@/lib/charts";

export function createWidget() {
  return ToastAreaChart({
        data: {
          labels: ["plane", "helicopter", "boat", "train", "subway", "bus", "car", "moto", "bicycle", "horse", "skateboard", "others"],
          datasets: [
            { legend: "Norway", values: [600, 1000, 800, 1000, 500, 850, 600, 675, 720, 890, 700, 950] },
            { legend: "Germany", values: [565, 850, 734, 863, 268, 571, 396, 588, 442, 726, 640, 732] },
            { legend: "US", values: [435, 559, 482, 580, 167, 308, 255, 557, 437, 438, 543, 554] },
          ],
        },
        config: {
          title: { text: "Transportation Usage by Country", visible: true, alignment: "center" },
          area: { spline: true, strokeWidth: 2, opacity: 0.3 },
        },
      });
}
