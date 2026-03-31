"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Border,
  Center,
  Text,
  TextStyle,
} from "flitter-ui";

export default function ServerLoadToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [12, 8, 5, 15, 65, 82, 78, 85, 80, 72, 45, 20],
            [10, 7, 4, 18, 70, 88, 82, 90, 85, 68, 42, 18],
            [14, 9, 6, 20, 72, 85, 80, 88, 82, 70, 48, 22],
            [11, 8, 5, 17, 68, 80, 75, 82, 78, 65, 40, 19],
            [15, 10, 7, 22, 75, 90, 85, 92, 88, 74, 50, 25],
            [8, 5, 3, 10, 25, 35, 40, 38, 32, 28, 20, 12],
            [6, 4, 2, 8, 18, 28, 32, 30, 25, 22, 15, 9],
          ],
        },
        config: {
          heatmap: { colorRange: ["#dbeafe", "#3b82f6", "#1e3a5f"], segment: { gap: 2 } },
          title: { text: "CPU Load (%)", visible: true },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const isCritical = value >= 85;
            const isWarning = value >= 70 && value < 85;
            const t = Math.min(value / 95, 1);
            const bg = isCritical
              ? "#dc2626"
              : isWarning
                ? "#f59e0b"
                : `rgba(59,130,246,${t * 0.8 + 0.05})`;
            return Container({
              decoration: new BoxDecoration({
                color: bg,
                border: isCritical
                  ? Border.all({ color: "#fca5a5", width: 2 })
                  : undefined,
              }),
              child: Center({
                child: isCritical || isWarning
                  ? Text(`${value}`, {
                      style: new TextStyle({
                        fontSize: 8,
                        color: "#ffffff",
                        fontWeight: "700",
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
