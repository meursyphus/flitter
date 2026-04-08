"use client";

export const galleryTitle = "Quarterly Revenue ($M)";

import Widget from "@flitterjs/react";
import { ToastBarChart } from "shared/chart";

export function createWidget() {
  return ToastBarChart({
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4", "H1", "H2"],
          datasets: [
            { legend: "2024 Revenue", values: [42, 51, 47, 58, 93, 105] },
            { legend: "2023 Revenue", values: [38, 44, 41, 49, 82, 90] },
          ],
        },
        config: {
          title: { text: "Quarterly Revenue ($M)", visible: true },
        },
      });
}

export default function BarChartToast() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
