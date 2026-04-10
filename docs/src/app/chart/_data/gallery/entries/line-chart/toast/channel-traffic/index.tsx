"use client";

export const galleryTitle = "Monthly Temperature by City";

import Widget from "@flitterjs/react";
import { ToastLineChart } from "shared/chart";

export function createWidget() {
  return ToastLineChart({
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        { legend: "Moscow", values: [-9.1, -7.2, -1.3, 6.4, 13.2, 17.0, 19.2, 17.1, 11.3, 5.0, -1.8, -6.5] },
        { legend: "London", values: [4.9, 5.2, 7.3, 9.6, 12.8, 16.0, 18.4, 18.1, 15.2, 11.5, 7.6, 5.1] },
        { legend: "Tokyo", values: [5.4, 6.1, 9.4, 14.3, 18.7, 21.8, 25.7, 27.2, 23.5, 17.6, 12.4, 7.2] },
      ],
    },
    config: {
      title: { text: "Monthly Average Temperature (°C)", visible: true, alignment: "center" },
      line: { spline: true },
    },
  });
}

export default function StockIndexReturns() {
  return (
    <Widget
      widget={createWidget()}
      width="100%"
      height="100%"
    />
  );
}
