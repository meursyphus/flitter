"use client";

import { ToastWaterfallChart } from "@/lib/charts";

export const galleryTitle = "Project Budget Remaining ($k)";

export function createWidget() {
  return ToastWaterfallChart({
    data: {
      rows: [
        {
          item: "Budget",
          amount: 120,
        },
        {
          item: "Design",
          amount: -22,
        },
        {
          item: "Engineering",
          amount: -46,
        },
        {
          item: "QA",
          amount: -14,
        },
        {
          item: "Scope added",
          amount: 18,
        },
        {
          item: "Launch",
          amount: -12,
        },
      ],
      xKey: "item",
      yKey: "amount",
      totals: [
        {
          totalType: "total",
          index: 5,
          axisLabel: "Remaining",
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
