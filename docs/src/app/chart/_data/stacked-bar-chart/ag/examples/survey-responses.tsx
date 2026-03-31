"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";
import { Text, TextStyle, Column, MainAxisSize, CrossAxisAlignment } from "flitter-ui";

export default function SurveyResponsesAg() {
  const datasets = [
    { legend: "Strongly Agree", values: [45, 28, 38, 52, 35] },
    { legend: "Agree", values: [30, 32, 28, 25, 30] },
    { legend: "Neutral", values: [15, 20, 18, 12, 18] },
    { legend: "Disagree", values: [10, 20, 16, 11, 17] },
  ];
  const labels = ["Work-Life Balance", "Compensation", "Growth", "Culture", "Leadership"];

  return (
    <Widget
      widget={StackedBarChart({
        direction: "horizontal",
        data: { labels, datasets },
        config: {
          colors: { fills: ["#22c55e", "#86efac", "#fcd34d", "#f87171"], strokes: ["#22c55e", "#86efac", "#fcd34d", "#f87171"] },
        },
        custom: {
          xAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const val = parseFloat(name);
            return Column({
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    color: "#64748b",
                  }),
                }),
                ...(val > 0 ? [
                  Text(`${val}%`, {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 8,
                      fontWeight: "bold",
                      color: val >= 80 ? "#16a34a" : "#94a3b8",
                    }),
                  }),
                ] : []),
              ],
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
