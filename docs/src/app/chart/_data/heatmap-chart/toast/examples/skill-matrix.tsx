"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  Border,
  Center,
  Text,
  TextStyle,
  Column,
  MainAxisSize,
  SizedBox,
  EdgeInsets,
} from "flitter-ui";

export default function SkillMatrixToast() {
  const labels = ["Beginner", "Basic", "Good", "Strong", "Expert"];
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["React", "Node.js", "Python", "SQL", "Docker", "AWS"],
          yLabels: ["Alice", "Bob", "Charlie", "Diana", "Eve"],
          values: [
            [90, 70, 60, 80, 50, 65],
            [75, 95, 40, 85, 80, 70],
            [50, 60, 95, 70, 85, 90],
            [85, 55, 75, 90, 40, 50],
            [70, 80, 80, 60, 90, 85],
          ],
        },
        config: {
          heatmap: { segment: { gap: 2 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const level = value >= 90 ? 4 : value >= 75 ? 3 : value >= 60 ? 2 : value >= 45 ? 1 : 0;
            const colors = ["#fee2e2", "#fef3c7", "#fef9c3", "#d1fae5", "#bbf7d0"];
            const borders = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#22c55e"];
            const label = labels[level];
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: colors[level],
                borderRadius: BorderRadius.circular(8),
                border: Border.all({ color: borders[level], width: 1.5 }),
              }),
              child: Center({
                child: Column({
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(`${value}`, {
                      style: new TextStyle({
                        fontSize: 11,
                        fontWeight: "700",
                        color: borders[level],
                      }),
                    }),
                    SizedBox({ height: 1 }),
                    Text(label, {
                      style: new TextStyle({
                        fontSize: 7,
                        color: borders[level],
                      }),
                    }),
                  ],
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
