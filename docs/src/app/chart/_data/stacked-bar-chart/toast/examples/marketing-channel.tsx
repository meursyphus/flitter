"use client";

import Widget from "@flitterjs/react";
import { ToastStackedBarChart as ToastStackedBarChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function MarketingChannelToast() {
  const datasets = [
    { legend: "SEO", values: [320, 380, 410, 450, 520, 580] },
    { legend: "Paid Ads", values: [210, 250, 230, 270, 290, 310] },
    { legend: "Social", values: [140, 160, 180, 200, 220, 250] },
    { legend: "Email", values: [90, 100, 110, 120, 130, 145] },
  ];

  return (
    <Widget
      widget={ToastStackedBarChartWidget({
        direction: "vertical",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets,
        },
        config: {
          colors: ["#0ea5e9", "#8b5cf6", "#f97316", "#10b981"],
          title: { text: "Marketing Conversions", visible: true },
          bar: { gap: 3 },
        },
        custom: {
          dataLabel: (
            { value, legend, label }: { value: number; label: string; legend: string },
            context: any,
          ) => {
            const { font } = context.config;
            const labelIdx = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].indexOf(label);
            const total = datasets.reduce((sum, ds) => sum + ds.values[labelIdx], 0);
            if (legend !== "Email") return Text("", { style: new TextStyle({}) });
            return Text(`${(total / 1000).toFixed(1)}K`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: 9,
                fontWeight: "bold",
                color: "#334155",
              }),
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
