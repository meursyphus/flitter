"use client";

import Widget from "@flitterjs/react";
import { StackedAreaChart } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function ResourceAllocationStackedArea() {
  return (
    <Widget
      widget={StackedAreaChart({
        data: {
          labels: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4", "Sprint 5", "Sprint 6", "Sprint 7", "Sprint 8"],
          datasets: [
            { legend: "Development", values: [45, 50, 48, 52, 55, 50, 53, 56] },
            { legend: "QA", values: [15, 18, 20, 22, 20, 25, 22, 24] },
            { legend: "Design", values: [12, 10, 8, 10, 12, 8, 10, 8] },
            { legend: "DevOps", values: [8, 10, 12, 10, 8, 12, 10, 12] },
          ],
        },
        config: {
          colors: { fills: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], strokes: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"] },
          area: { opacity: 0.5 },
          title: { text: "Resource Allocation", visible: true },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const value = parseFloat(name);
            const isOverCapacity = value >= 80;
            return Text(`${name} hrs`, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: font.size,
                fontWeight: isOverCapacity ? "bold" : "normal",
                color: isOverCapacity ? "#dc2626" : "#585858",
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
