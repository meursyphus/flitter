"use client";

export const galleryTitle = "Ice Cream Sales by Flavor ($K)";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";

export function createWidget() {
  return ToastHeatmapChart({
    data: {
      xLabels: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      yLabels: [
        "Vanilla", "Chocolate", "Strawberry",
        "Mint Chip", "Cookie Dough", "Mango Sorbet",
      ],
      values: [
        [12, 11, 14, 18, 28, 38, 52, 50, 32, 20, 14, 13],
        [15, 14, 16, 20, 30, 40, 54, 51, 34, 22, 16, 17],
        [8, 7, 10, 15, 24, 34, 46, 44, 28, 16, 9, 8],
        [6, 5, 7, 10, 16, 22, 30, 28, 18, 11, 7, 6],
        [10, 9, 12, 16, 22, 30, 42, 40, 26, 17, 11, 12],
        [4, 3, 6, 12, 22, 36, 48, 46, 30, 14, 5, 3],
      ],
    },
    config: {
      title: { text: "Monthly Ice Cream Sales by Flavor ($K)", visible: true },
      heatmap: {
        colorRange: ["#FEE2E2", "#EF4444", "#7F1D1D"],
        segment: { gap: 0 },
      },
    },
  });
}

export default function MonthlyProductSales() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
