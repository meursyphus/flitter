"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";

export default function MarketingChannelToast() {
  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            { legend: "SEO", values: [320, 380, 410, 450, 520, 580] },
            { legend: "Paid Ads", values: [210, 250, 230, 270, 290, 310] },
            { legend: "Social", values: [140, 160, 180, 200, 220, 250] },
            { legend: "Email", values: [90, 100, 110, 120, 130, 145] },
          ],
        },
        config: { colors: ["#0ea5e9", "#8b5cf6", "#f97316", "#10b981"] },
      })}
      width="100%"
      height="100%"
    />
  );
}
