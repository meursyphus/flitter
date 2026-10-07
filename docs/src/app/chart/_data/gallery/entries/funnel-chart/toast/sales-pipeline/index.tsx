"use client";

import { ToastFunnelChart } from "@/lib/charts";

export const galleryTitle = "Sales Pipeline Conversion";

export function createWidget() {
  return ToastFunnelChart({
    data: {
      stages: [
        {
          label: "Leads",
          value: 2400,
        },
        {
          label: "Qualified",
          value: 1680,
        },
        {
          label: "Demo booked",
          value: 1080,
        },
        {
          label: "Proposal sent",
          value: 720,
        },
        {
          label: "Closed won",
          value: 480,
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
