"use client";

export const galleryTitle = "Cloud Infrastructure Spend";

import { ToastDonutChart } from "@/lib/charts";

export function createWidget() {
  return ToastDonutChart({
        data: {
          datasets: [
            { name: "AWS", value: 32 },
            { name: "Azure", value: 23 },
            { name: "Google Cloud", value: 11 },
            { name: "Alibaba", value: 5 },
            { name: "Oracle", value: 4 },
            { name: "Other", value: 25 },
          ],
        },
        config: {
          legend: { visible: false },
          radial: { visible: false },
        },
      });
}
