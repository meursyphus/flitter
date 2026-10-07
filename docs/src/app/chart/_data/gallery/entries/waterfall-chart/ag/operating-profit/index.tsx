"use client";

import { WaterfallChart } from "@/lib/charts";

export const galleryTitle = "Revenue to Operating Profit ($k)";

export function createWidget() {
  return WaterfallChart({
    data: {
      rows: [
        {
          item: "Revenue",
          amount: 180,
        },
        {
          item: "Services",
          amount: 25,
        },
        {
          item: "Materials",
          amount: -54,
        },
        {
          item: "Payroll",
          amount: -62,
        },
        {
          item: "Operations",
          amount: -24,
        },
      ],
      xKey: "item",
      yKey: "amount",
      totals: [
        {
          totalType: "total",
          index: 4,
          axisLabel: "Profit",
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
