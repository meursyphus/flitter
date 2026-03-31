"use client";

import Widget from "@flitterjs/react";
import { ToastBarChart as ToastBarChartWidget } from "shared/chart";

export default function FeaturedRevenueToast() {
  return (
    <Widget
      widget={ToastBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { legend: "North America", values: [4.2, 4.8, 3.9, 5.1, 5.6, 5.3] },
            { legend: "Europe", values: [3.1, 2.9, 3.4, 3.2, 3.8, 3.6] },
            { legend: "Asia Pacific", values: [2.1, 2.5, 2.3, 2.8, 2.6, 3.0] },
          ],
        },
        config: {
          colors: ["#0d9488", "#14b8a6", "#99f6e4"],
          title: { text: "Monthly Revenue ($M)", visible: true },
          legend: { position: "right-center" },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
