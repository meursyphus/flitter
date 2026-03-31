"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";
import { Transform, Text, TextStyle, Alignment } from "flitter-ui";

export default function TrafficSourceStackedArea() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          datasets: [
            { legend: "Search", values: [3200, 3400, 3600, 3900, 4100, 4300, 4500, 4200, 4600, 4800, 5000, 5200] },
            { legend: "Social Media", values: [800, 950, 1100, 1300, 1500, 1800, 2000, 2200, 1900, 1700, 1600, 1400] },
            { legend: "Email", values: [600, 580, 620, 650, 700, 680, 720, 710, 750, 780, 800, 820] },
            { legend: "Direct", values: [1200, 1250, 1300, 1280, 1350, 1400, 1380, 1420, 1450, 1500, 1520, 1550] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6"],
          area: { opacity: 0.5 },
        },
        custom: {
          xAxisLabel: ({ name, index }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            return Transform.rotate({
              angle: -Math.PI / 6,
              alignment: Alignment.centerRight,
              child: Text(name.slice(0, 3), {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: 10,
                  fontWeight: index % 3 === 0 ? "bold" : "normal",
                  color: index % 3 === 0 ? "#1e40af" : "#94a3b8",
                }),
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
