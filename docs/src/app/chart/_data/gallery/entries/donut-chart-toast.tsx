"use client";

export const galleryTitle = "Monthly Expenses";

import Widget from "@flitterjs/react";
import { ToastDonutChart } from "shared/chart";

export function createWidget() {
  return ToastDonutChart({
        data: {
          datasets: [
            { name: "Housing", value: 35 },
            { name: "Food", value: 20 },
            { name: "Transport", value: 15 },
            { name: "Entertainment", value: 12 },
            { name: "Savings", value: 10 },
            { name: "Other", value: 8 },
          ],
        },
        config: {
          title: { text: "Monthly Expenses", visible: true },
        },
      });
}

export default function DonutChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
