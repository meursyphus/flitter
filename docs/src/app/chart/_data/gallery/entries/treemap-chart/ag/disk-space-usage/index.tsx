"use client";

export const galleryTitle = "Disk Space Usage";

import Widget from "@flitterjs/react";
import { TreemapChart } from "shared/chart";

export function createWidget() {
  return TreemapChart({
    data: {
      datasets: [
        {
          legend: "Media",
          children: [
            { label: "Photos", secondaryLabel: "30 GB", value: 30 },
            { label: "Videos", secondaryLabel: "45 GB", value: 45 },
            { label: "Music", secondaryLabel: "12 GB", value: 12 },
          ],
        },
        {
          legend: "Work",
          children: [
            { label: "Documents", secondaryLabel: "18 GB", value: 18 },
            { label: "Projects", secondaryLabel: "25 GB", value: 25 },
          ],
        },
        {
          legend: "System",
          children: [
            { label: "Applications", secondaryLabel: "22 GB", value: 22 },
            { label: "OS & Cache", secondaryLabel: "35 GB", value: 35 },
          ],
        },
        {
          legend: "Other",
          value: 8,
          secondaryLabel: "8 GB",
        },
      ],
    },
    config: {
      title: { text: "Disk Space Usage (195 GB)", visible: true },
    },
  });
}

export default function TreemapChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
