"use client";

import Widget from "@flitterjs/react";
import {
  Transform,
  Text,
  TextStyle,
  Alignment,
  Container,
  BoxDecoration,
  BorderRadius,
  EdgeInsets,
} from "flitter-ui";
import { BarChart } from "shared/chart";

export default function ProductComparisonAg() {
  return (
    <Widget
      widget={BarChart({
        direction: "vertical",
        data: {
          labels: ["Design", "Speed", "Support"],
          datasets: [
            { legend: "Ours", values: [92, 76, 88] },
            { legend: "Competitor A", values: [68, 91, 72] },
            { legend: "Competitor B", values: [79, 84, 65] },
          ],
        },
        custom: {
          xAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font, axis } = context.config;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 3 }),
              decoration: new BoxDecoration({
                color: "#f0f9ff",
                borderRadius: BorderRadius.circular(4),
              }),
              child: Text(name, {
                style: new TextStyle({
                  fontFamily: font.family,
                  fontSize: axis.label.fontSize,
                  color: "#0369a1",
                }),
              }),
            });
          },
        },
        config: {
          colors: { fills: ["#0ea5e9", "#f97316", "#8b5cf6"] },
          title: { text: "Product Comparison", visible: true },
          bar: { cornerRadius: 3 },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
