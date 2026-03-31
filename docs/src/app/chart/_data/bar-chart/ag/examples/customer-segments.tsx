"use client";

import Widget from "@flitterjs/react";
import { BarChart } from "shared/chart";
import { Container, BoxDecoration, EdgeInsets, BorderRadius, BoxShadow } from "flitter-ui";

const datasetColors = ["#10b981", "#3b82f6", "#ef4444"];

export default function CustomerSegmentsAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Enterprise", "Mid-Market", "SMB", "Startup"],
          datasets: [
            { legend: "New ARR ($K)", values: [480, 320, 190, 85] },
            { legend: "Expansion ($K)", values: [210, 145, 70, 32] },
            { legend: "Churn ($K)", values: [-95, -68, -42, -28] },
          ],
        },
        config: {
          colors: { fills: datasetColors },
          bar: { cornerRadius: 4 },
          title: { text: "Customer Segments", visible: true },
        },
        custom: {
          bar: (
            { value, legend }: { value: number; label: string; legend: string; index: number },
            context: any,
          ) => {
            const idx = context.legends.indexOf(legend);
            const color = datasetColors[idx] ?? "#94a3b8";
            const isChurn = value < 0;
            return Container({
              margin: EdgeInsets.symmetric({ horizontal: 1 }),
              decoration: new BoxDecoration({
                color: color,
                borderRadius: BorderRadius.circular(4),
                boxShadow: isChurn
                  ? [new BoxShadow({ color: "rgba(239,68,68,0.3)", blurRadius: 6 })]
                  : [],
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
