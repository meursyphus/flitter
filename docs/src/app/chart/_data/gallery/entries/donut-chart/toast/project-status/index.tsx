"use client";

export const galleryTitle = "Cloud Infrastructure Spend";

import Widget from "@flitterjs/react";
import { ToastDonutChart } from "shared/chart";

export function createWidget() {
  return ToastDonutChart({
        data: {
          datasets: [
            { name: "AWS", value: 32 },
            { name: "Azure", value: 23 },
            { name: "Google Cloud", value: 11 },
            { name: "Alibaba", value: 5 },
            { name: "Oracle", value: 4 },
            { name: "Other", value: 25 },
          ],
        },
        config: {
          legend: { visible: false },
          radial: { visible: false },
        },
      });
}

export default function DonutChartToastProjectStatus() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
