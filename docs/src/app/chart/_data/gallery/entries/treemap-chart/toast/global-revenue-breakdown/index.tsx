"use client";

export const galleryTitle = "Global Streaming Revenue (2025)";

import Widget from "@flitterjs/react";
import { ToastTreemapChart } from "shared/chart";

export function createWidget() {
  return ToastTreemapChart({
    data: {
      datasets: [
        {
          legend: "Video",
          children: [
            { label: "Netflix", secondaryLabel: "$38.3B", value: 383 },
            { label: "Disney+", secondaryLabel: "$22.1B", value: 221 },
            { label: "YouTube Premium", secondaryLabel: "$15.7B", value: 157 },
          ],
        },
        {
          legend: "Music",
          children: [
            { label: "Spotify", secondaryLabel: "$18.4B", value: 184 },
            { label: "Apple Music", secondaryLabel: "$9.6B", value: 96 },
          ],
        },
        {
          legend: "Gaming",
          children: [
            { label: "Xbox Game Pass", secondaryLabel: "$12.2B", value: 122 },
            { label: "PS Plus", secondaryLabel: "$8.5B", value: 85 },
          ],
        },
        {
          legend: "Other",
          value: 42,
          secondaryLabel: "$4.2B",
        },
      ],
    },
    config: {
      title: { text: "Global Streaming Revenue by Platform (2025)", visible: true },
    },
  });
}

export default function TreemapChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
