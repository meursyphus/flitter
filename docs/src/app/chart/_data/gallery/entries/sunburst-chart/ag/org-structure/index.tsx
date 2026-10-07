"use client";

import { SunburstChart } from "@/lib/charts";

export const galleryTitle = "Company Organization";

export function createWidget() {
  return SunburstChart({
    data: {
      nodes: [
        {
          label: "Engineering",
          value: 66,
          children: [
            {
              label: "Frontend",
              value: 28,
              children: [],
            },
            {
              label: "Platform",
              value: 22,
              children: [],
            },
            {
              label: "Data",
              value: 16,
              children: [],
            },
          ],
        },
        {
          label: "Product",
          value: 20,
          children: [
            {
              label: "Design",
              value: 12,
              children: [],
            },
            {
              label: "Research",
              value: 8,
              children: [],
            },
          ],
        },
        {
          label: "Business",
          value: 42,
          children: [
            {
              label: "Sales",
              value: 18,
              children: [],
            },
            {
              label: "Success",
              value: 14,
              children: [],
            },
            {
              label: "Operations",
              value: 10,
              children: [],
            },
          ],
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
