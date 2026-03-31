"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  EdgeInsets,
  BoxShadow,
} from "flitter-ui";

export default function GithubActivityToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [3, 0, 5, 2, 8, 1, 0, 4, 6, 9, 2, 1],
            [0, 7, 3, 0, 2, 5, 1, 0, 8, 3, 0, 4],
            [5, 2, 0, 6, 1, 0, 9, 3, 2, 0, 7, 2],
            [1, 0, 4, 3, 0, 8, 2, 7, 0, 5, 1, 0],
            [0, 3, 1, 0, 5, 2, 0, 1, 4, 0, 3, 6],
            [2, 1, 0, 0, 1, 0, 3, 0, 1, 2, 0, 0],
            [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0],
          ],
        },
        config: {
          heatmap: { segment: { gap: 3 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const greens = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
            const level = value === 0 ? 0 : value <= 2 ? 1 : value <= 4 ? 2 : value <= 6 ? 3 : 4;
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: greens[level],
                borderRadius: BorderRadius.circular(3),
                boxShadow: value >= 7
                  ? [new BoxShadow({ color: "#39d353", blurRadius: 6 })]
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
