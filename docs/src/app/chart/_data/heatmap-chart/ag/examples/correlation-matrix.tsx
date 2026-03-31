"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  BorderRadius,
  Center,
  Text,
  TextStyle,
  EdgeInsets,
} from "flitter-ui";

export default function CorrelationMatrixAg() {
  return (
    <Widget
      widget={HeatmapChart({
        data: {
          xLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
          yLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
          values: [
            [100, 85, 78, -45, 62, 70],
            [85, 100, 92, -52, 58, 75],
            [78, 92, 100, -60, 65, 82],
            [-45, -52, -60, 100, -38, -55],
            [62, 58, 65, -38, 100, 72],
            [70, 75, 82, -55, 72, 100],
          ],
        },
        config: {
          heatmap: { colorRange: ["#ef4444", "#f5f5f5", "#3b82f6"], segment: { gap: 2 } },
        },
        custom: {
          segment: ({ value, xIndex, yIndex }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const isDiag = xIndex === yIndex;
            const isUpper = xIndex > yIndex;
            if (isUpper) {
              return Container({
                decoration: new BoxDecoration({ color: "transparent" }),
              });
            }
            const abs = Math.abs(value);
            const isNeg = value < 0;
            const bg = isDiag
              ? "#334155"
              : isNeg
                ? `rgba(239,68,68,${abs / 110})`
                : `rgba(59,130,246,${abs / 110})`;
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: bg,
                borderRadius: BorderRadius.circular(isDiag ? 0 : 4),
              }),
              child: Center({
                child: Text(isDiag ? "1.0" : (value / 100).toFixed(1), {
                  style: new TextStyle({
                    fontSize: 10,
                    color: isDiag || abs > 50 ? "#ffffff" : "#374151",
                    fontWeight: isDiag ? "700" : "400",
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
