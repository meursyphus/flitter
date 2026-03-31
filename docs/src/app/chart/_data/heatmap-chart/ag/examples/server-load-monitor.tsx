"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Border,
  Center,
  Text,
  TextStyle,
} from "flitter-ui";

export default function ServerLoadMonitorAg() {
  return (
    <Widget
      widget={HeatmapChart({
        data: {
          xLabels: ["00", "04", "08", "12", "16", "20"],
          yLabels: ["web-01", "web-02", "api-01", "api-02", "db-01", "cache"],
          values: [
            [15, 8, 72, 85, 68, 30],
            [12, 6, 78, 90, 72, 25],
            [20, 10, 65, 80, 55, 35],
            [18, 9, 70, 82, 60, 32],
            [40, 25, 88, 95, 82, 50],
            [8, 4, 45, 60, 38, 15],
          ],
        },
        config: {
          title: { text: "Infrastructure Dashboard", visible: true },
          background: "#111827",
          heatmap: { segment: { gap: 2 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const status = value >= 90 ? "critical" : value >= 75 ? "warning" : value >= 50 ? "elevated" : "normal";
            const bgMap: Record<string, string> = {
              critical: "#dc2626",
              warning: "#d97706",
              elevated: "#2563eb",
              normal: "#1e3a5f",
            };
            const borderColor = status === "critical" ? "#fca5a5" : status === "warning" ? "#fcd34d" : "transparent";
            return Container({
              decoration: new BoxDecoration({
                color: bgMap[status],
                border: status === "critical" || status === "warning"
                  ? Border.all({ color: borderColor, width: 2 })
                  : undefined,
              }),
              child: Center({
                child: Text(
                  status === "critical" ? `!! ${value}%` : `${value}%`,
                  {
                    style: new TextStyle({
                      fontSize: 9,
                      color: "#ffffff",
                      fontWeight: status === "critical" ? "800" : status === "warning" ? "600" : "400",
                    }),
                  },
                ),
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
