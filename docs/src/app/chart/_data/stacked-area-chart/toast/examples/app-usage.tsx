"use client";

import Widget from "@flitterjs/react";
import { ToastStackedAreaChart as ToastStackedAreaChartWidget } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Border,
  BorderSide,
  Text,
  TextStyle,
} from "flitter-ui";

export default function AppUsageToastStackedArea() {
  return (
    <Widget
      widget={ToastStackedAreaChartWidget({
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "iOS", values: [4500, 4700, 4900, 5200, 5500, 5800, 6100, 6000, 5900, 6200, 6500, 6800] },
            { legend: "Android", values: [5200, 5400, 5700, 6000, 6400, 6700, 7000, 6900, 6800, 7100, 7400, 7800] },
            { legend: "Web", values: [2800, 2900, 3000, 3100, 3200, 3100, 2900, 2800, 3100, 3300, 3500, 3600] },
          ],
        },
        config: {
          colors: ["#3b82f6", "#10b981", "#f59e0b"],
          area: { opacity: 0.45, strokeWidth: 2.5 },
          title: { text: "App Sessions by Platform", visible: true, alignment: "center" },
        },
        custom: {
          xAxisLabel: ({ name, index }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const isQuarterStart = index % 3 === 0;
            return Container({
              decoration: isQuarterStart
                ? new BoxDecoration({
                    border: new Border({
                      bottom: new BorderSide({ color: "#3b82f6", width: 2 }),
                    }),
                  })
                : undefined,
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: font.size,
                  fontWeight: isQuarterStart ? "bold" : "normal",
                  color: isQuarterStart ? "#1e40af" : "#94a3b8",
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
