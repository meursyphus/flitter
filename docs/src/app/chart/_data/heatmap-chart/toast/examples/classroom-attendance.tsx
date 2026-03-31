"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  Center,
  Text,
  TextStyle,
  EdgeInsets,
} from "flitter-ui";

export default function ClassroomAttendanceToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
          yLabels: ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"],
          values: [
            [100, 100, 80, 100, 100, 60, 100, 100],
            [80, 60, 100, 80, 100, 100, 80, 60],
            [100, 100, 100, 100, 80, 100, 100, 100],
            [60, 80, 100, 40, 80, 100, 60, 80],
            [100, 100, 100, 100, 100, 100, 80, 100],
            [80, 100, 60, 80, 100, 80, 100, 100],
          ],
        },
        config: {
          heatmap: { segment: { gap: 3 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const emoji = value === 100 ? "\u2705" : value >= 80 ? "\ud83d\udfe1" : value >= 60 ? "\u26a0\ufe0f" : "\u274c";
            const bg = value === 100 ? "#dcfce7" : value >= 80 ? "#fef9c3" : value >= 60 ? "#fff7ed" : "#fef2f2";
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: bg,
                borderRadius: BorderRadius.circular(4),
              }),
              child: Center({
                child: Text(emoji, {
                  style: new TextStyle({ fontSize: 12 }),
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
