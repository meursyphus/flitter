"use client";

import Widget from "@flitterjs/react";
import { StackedBarChart } from "shared/chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

export default function DepartmentHeadcountAg() {
  return (
    <Widget
      widget={StackedBarChart({
        direction: "horizontal",
        data: {
          labels: ["Engineering", "Marketing", "Sales", "Support", "Design", "Product", "Finance"],
          datasets: [
            { legend: "Full-Time", values: [120, 45, 60, 35, 25, 18, 22] },
            { legend: "Contract", values: [30, 15, 20, 25, 10, 5, 8] },
            { legend: "Intern", values: [15, 8, 5, 10, 6, 3, 2] },
          ],
        },
        config: {
          colors: { fills: ["#6366f1", "#ec4899", "#10b981"], strokes: ["#6366f1", "#ec4899", "#10b981"] },
        },
        custom: {
          yAxisLabel: (
            { name }: { name: string; index: number },
            context: any,
          ) => {
            const { font } = context.config;
            const emojiMap: Record<string, string> = {
              Engineering: "dev",
              Marketing: "mkt",
              Sales: "sales",
              Support: "ops",
              Design: "ux",
              Product: "pm",
              Finance: "fin",
            };
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(emojiMap[name] ?? "", {
                  style: new TextStyle({
                    fontFamily: "monospace",
                    fontSize: 9,
                    fontWeight: "bold",
                    color: "#6366f1",
                  }),
                }),
                SizedBox({ width: 4 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    color: "#334155",
                  }),
                }),
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
