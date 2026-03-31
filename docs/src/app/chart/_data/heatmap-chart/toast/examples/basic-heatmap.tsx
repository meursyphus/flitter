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

export default function BasicHeatmapToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [2, 5, 8, 12, 18, 24, 28, 30, 25, 16, 9, 4],
            [3, 6, 9, 13, 19, 25, 29, 31, 26, 17, 10, 5],
            [4, 7, 11, 15, 21, 27, 32, 34, 28, 19, 12, 6],
            [5, 8, 12, 16, 22, 28, 33, 35, 29, 20, 13, 7],
            [4, 7, 10, 14, 20, 26, 31, 33, 27, 18, 11, 6],
            [3, 5, 8, 11, 17, 23, 27, 29, 24, 15, 9, 4],
            [2, 4, 7, 10, 16, 22, 26, 28, 23, 14, 8, 3],
          ],
        },
        config: {
          heatmap: { colorRange: ["#dbeafe", "#3b82f6", "#1e3a8a"], segment: { gap: 3 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const t = Math.min(value / 35, 1);
            const r = Math.round(219 + (30 - 219) * t);
            const g = Math.round(234 + (58 - 234) * t);
            const b = Math.round(254 + (138 - 254) * t);
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: `rgb(${r},${g},${b})`,
                borderRadius: BorderRadius.circular(6),
              }),
              child: Center({
                child: value >= 15
                  ? Text(`${value}°`, {
                      style: new TextStyle({
                        fontSize: 9,
                        color: t > 0.5 ? "#ffffff" : "#1e3a8a",
                        fontWeight: "600",
                      }),
                    })
                  : Text("", { style: new TextStyle({}) }),
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
