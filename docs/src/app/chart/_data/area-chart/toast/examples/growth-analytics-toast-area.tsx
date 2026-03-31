"use client";

import Widget from "@flitterjs/react";
import { ToastAreaChart as ToastAreaChartWidget } from "shared/chart";
import {
  Row,
  Container,
  BoxDecoration,
  SizedBox,
  Text,
  TextStyle,
  CrossAxisAlignment,
  EdgeInsets,
  BorderRadius,
} from "flitter-ui";

const colors = ["#0ea5e9", "#8b5cf6", "#f59e0b"];
const latestValues = ["$76K", "$900K", "128%"];

export default function GrowthAnalyticsToastArea() {
  return (
    <Widget
      widget={ToastAreaChartWidget({
        data: {
          labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
          datasets: [
            { legend: "MRR ($K)", values: [18, 24, 31, 38, 47, 55, 64, 76] },
            { legend: "ARR ($K)", values: [210, 280, 365, 450, 560, 650, 760, 900] },
            { legend: "NRR (%)", values: [105, 108, 112, 115, 118, 121, 124, 128] },
          ],
        },
        config: {
          colors: ["#0ea5e9", "#8b5cf6", "#f59e0b"],
          legend: { position: "right" },
          title: { text: "Growth Metrics", visible: true },
          area: {
            strokeWidth: 2,
            opacity: 0.25,
            spline: false,
          },
        },
        custom: {
          legend: ({ name, index }: { name: string; index: number }) =>
            Row({
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container({
                  width: 8,
                  height: 8,
                  decoration: new BoxDecoration({
                    color: colors[index],
                    borderRadius: BorderRadius.circular(4),
                  }),
                }),
                SizedBox({ width: 6 }),
                Text(name, {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#475569",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(latestValues[index] ?? "", {
                  style: new TextStyle({
                    fontSize: 11,
                    color: "#0ea5e9",
                    fontWeight: "600",
                  }),
                }),
              ],
            }),
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
