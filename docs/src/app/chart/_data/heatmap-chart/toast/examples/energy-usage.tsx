"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import { Text, TextStyle, Transform, Alignment } from "flitter-ui";

export default function EnergyUsageToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"],
          yLabels: ["Kitchen", "Living", "Bed", "Office", "Garage"],
          values: [
            [30, 80, 60, 90, 50, 70, 95, 40, 15],
            [10, 20, 30, 25, 35, 40, 65, 80, 50],
            [5, 5, 10, 8, 12, 15, 20, 45, 70],
            [5, 60, 75, 50, 80, 70, 30, 10, 5],
            [15, 25, 10, 8, 12, 20, 35, 15, 5],
          ],
        },
        config: {
          heatmap: { colorRange: ["#ecfdf5", "#10b981", "#064e3b"] },
        },
        custom: {
          xAxisLabel: ({ name, index }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const isPeak = index >= 2 && index <= 6;
            return Transform.rotate({
              angle: -Math.PI / 6,
              alignment: Alignment.center,
              child: Text(isPeak ? `${name} *` : name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: font.size,
                  fontWeight: isPeak ? "700" : "normal",
                  color: isPeak ? "#064e3b" : "#6b7280",
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
