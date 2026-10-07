"use client";

import { FunnelChart } from "@/lib/charts";

export const galleryTitle = "Product Onboarding Funnel";

export function createWidget() {
  return FunnelChart({
    data: {
      stages: [
        {
          label: "Sign-ups",
          value: 12000,
        },
        {
          label: "Email verified",
          value: 9600,
        },
        {
          label: "Workspace created",
          value: 7200,
        },
        {
          label: "First project",
          value: 4800,
        },
        {
          label: "Team invited",
          value: 3000,
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
