"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function RevenueStreamStackedArea() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24"],
          datasets: [
            { legend: "Subscriptions", values: [4200, 4500, 4800, 5100, 5500, 5900, 6300, 6800] },
            { legend: "Licensing", values: [1800, 1900, 2000, 2200, 2100, 2300, 2500, 2700] },
            { legend: "Services", values: [900, 1000, 1100, 1200, 1300, 1400, 1500, 1600] },
            { legend: "Hardware", values: [600, 550, 500, 700, 650, 600, 750, 800] },
          ],
        },
        config: {
          colors: ["#0d9488", "#d97706", "#ec4899", "#64748b"],
          area: { opacity: 0.4, strokeWidth: 1.5 },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const value = parseFloat(name);
            const formatted = value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`;
            const isHigh = value >= 10000;
            return Text(formatted, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: isHigh ? "bold" : "normal",
                color: isHigh ? "#0d9488" : "#64748b",
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
