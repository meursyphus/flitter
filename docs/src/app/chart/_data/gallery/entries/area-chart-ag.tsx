"use client";

export const galleryTitle = "Website Traffic";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

export function createWidget() {
  return AreaChart({
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            { legend: "Organic", values: [4200, 4800, 5100, 4900, 5300, 6100, 5800] },
            { legend: "Paid", values: [2100, 2400, 2800, 3100, 2700, 3500, 3200] },
          ],
        },
        config: {
          title: { text: "Website Traffic", visible: true },
        },
      });
}

export default function AreaChartAg() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
