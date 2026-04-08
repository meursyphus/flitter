"use client";

export const galleryTitle = "Portfolio Allocation";

import Widget from "@flitterjs/react";
import { ToastTreemapChart } from "shared/chart";

export function createWidget() {
  return ToastTreemapChart({
        data: {
          datasets: [
            {
              legend: "Equities",
              children: [
                { label: "US Large Cap", secondaryLabel: "$45K", value: 45 },
                { label: "US Small Cap", secondaryLabel: "$15K", value: 15 },
                { label: "International", secondaryLabel: "$20K", value: 20 },
              ],
            },
            {
              legend: "Fixed Income",
              children: [
                { label: "Government", secondaryLabel: "$25K", value: 25 },
                { label: "Corporate", secondaryLabel: "$18K", value: 18 },
              ],
            },
            {
              legend: "Alternatives",
              value: 12,
              secondaryLabel: "$12K",
            },
            {
              legend: "Cash",
              value: 8,
              secondaryLabel: "$8K",
            },
          ],
        },
        config: {
          title: { text: "Portfolio Allocation", visible: true },
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
