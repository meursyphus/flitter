"use client";

import { ToastSunburstChart } from "@/lib/charts";

export const galleryTitle = "World Population by Region (millions)";

export function createWidget() {
  return ToastSunburstChart({
    data: {
      nodes: [
        {
          label: "Asia",
          value: 4820,
          children: [
            {
              label: "East",
              value: 1660,
              children: [],
            },
            {
              label: "South",
              value: 2050,
              children: [],
            },
            {
              label: "Southeast",
              value: 690,
              children: [],
            },
            {
              label: "West & Central",
              value: 420,
              children: [],
            },
          ],
        },
        {
          label: "Africa",
          value: 1520,
          children: [
            {
              label: "North",
              value: 270,
              children: [],
            },
            {
              label: "Sub-Saharan",
              value: 1250,
              children: [],
            },
          ],
        },
        {
          label: "Americas",
          value: 1040,
          children: [
            {
              label: "North",
              value: 380,
              children: [],
            },
            {
              label: "Latin America",
              value: 660,
              children: [],
            },
          ],
        },
        {
          label: "Europe",
          value: 740,
          children: [
            {
              label: "West & North",
              value: 310,
              children: [],
            },
            {
              label: "East & South",
              value: 430,
              children: [],
            },
          ],
        },
        {
          label: "Oceania",
          value: 46,
          children: [
            {
              label: "Oceania",
              value: 46,
              children: [],
            },
          ],
        },
      ],
    },

    config: { title: { text: galleryTitle, visible: true } },
  });
}
