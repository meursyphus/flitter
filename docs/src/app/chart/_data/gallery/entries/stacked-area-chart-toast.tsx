"use client";

export const galleryTitle = "Revenue by Product Line ($K)";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart } from "shared/chart";

export function createWidget() {
  return ToastStackedAreaChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { legend: "SaaS", values: [120, 135, 148, 162, 175, 190] },
            { legend: "Consulting", values: [80, 75, 90, 85, 95, 100] },
            { legend: "Licensing", values: [45, 50, 42, 55, 48, 60] },
          ],
        },
        config: {
          title: { text: "Revenue by Product Line ($K)", visible: true },
        },
      });
}

export default function StackedAreaChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
