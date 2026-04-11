"use client";

export const galleryTitle = "Quarterly Profit & Loss by Division";

import Widget from "@flitterjs/react";
import { AreaChart } from "shared/chart";

export function createWidget() {
  return AreaChart({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Hardware", values: [-12.4, -8.7, -3.2, 4.5, 9.8, 15.2, 18.6, 14.3, 7.1, -2.5, -9.8, -14.1] },
            { legend: "Software", values: [5.3, 8.1, 12.7, 18.4, 22.0, 25.6, 28.9, 26.2, 19.5, 11.8, 6.4, 3.1] },
            { legend: "Services", values: [-4.8, -6.2, -1.5, 3.7, 8.4, 11.0, 13.5, 9.8, 2.3, -3.6, -7.9, -10.2] },
          ],
        },
        config: {
          title: { text: "Monthly Profit & Loss by Division", visible: true, alignment: "center" },
          subtitle: { text: "Revenue minus costs ($M) — 2024", visible: true },
          area: { spline: false, strokeWidth: 2, opacity: 0.25 },
        },
      });
}

export default function AreaChartAgProfitLoss() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
