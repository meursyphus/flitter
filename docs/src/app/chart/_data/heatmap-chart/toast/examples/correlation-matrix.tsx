"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Center,
  Text,
  TextStyle,
  Border,
} from "flitter-ui";

export default function CorrelationMatrixToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
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
          heatmap: { colorRange: ["#ef4444", "#f5f5f5", "#3b82f6"], segment: { gap: 1 } },
        },
        custom: {
          segment: ({ value, xIndex, yIndex }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const isDiagonal = xIndex === yIndex;
            const t = (value + 100) / 200;
            const isNeg = value < 0;
            const abs = Math.abs(value);
            const bg = isDiagonal
              ? "#1e293b"
              : isNeg
                ? `rgba(239,68,68,${abs / 120})`
                : `rgba(59,130,246,${abs / 120})`;
            const fg = isDiagonal || abs > 60 ? "#ffffff" : "#1e293b";
            return Container({
              decoration: new BoxDecoration({
                color: bg,
                border: isDiagonal
                  ? Border.all({ color: "#3b82f6", width: 2 })
                  : undefined,
              }),
              child: Center({
                child: Text(isDiagonal ? "1.0" : (value / 100).toFixed(2), {
                  style: new TextStyle({
                    fontSize: isDiagonal ? 11 : 9,
                    color: fg,
                    fontWeight: isDiagonal ? "700" : "500",
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
