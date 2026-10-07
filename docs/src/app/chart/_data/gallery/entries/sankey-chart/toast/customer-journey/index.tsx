"use client";

import { ToastSankeyChart } from "@/lib/charts";

export const galleryTitle = "From Discovery to Subscription";

export function createWidget() {
  return ToastSankeyChart({
    data: [
      {
        from: "Search",
        to: "Trial",
        value: 420,
      },
      {
        from: "Referrals",
        to: "Trial",
        value: 260,
      },
      {
        from: "Social",
        to: "Trial",
        value: 180,
      },
      {
        from: "Trial",
        to: "Subscribed",
        value: 560,
      },
      {
        from: "Trial",
        to: "Not converted",
        value: 300,
      },
    ],

    config: { title: { text: galleryTitle, visible: true } },
  });
}
