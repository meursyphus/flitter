"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Center,
  Text,
  TextStyle,
} from "flitter-ui";

export default function SkillMatrixToast() {
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
          heatmap: { colorRange: ["#fef9c3", "#f97316", "#dc2626"], segment: { gap: 1 } },
        },
        custom: {
          segment: ({ value }: { value: number }) => {
            const bg =
              value >= 75
                ? "#dc2626"
                : value >= 50
                  ? "#f97316"
                  : "#fef9c3";
            const fg = value >= 50 ? "#ffffff" : "#1e293b";
            return Container({
              decoration: new BoxDecoration({ color: bg }),
              child: Center({
                child: Text(`${value}`, {
                  style: new TextStyle({
                    fontSize: 10,
                    color: fg,
                    fontWeight: "600",
                  }),
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
