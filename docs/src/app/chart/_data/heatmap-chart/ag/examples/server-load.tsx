"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";
import {
  Container,
  BoxDecoration,
  Center,
  Text,
  TextStyle,
} from "flitter-ui";

export default function ServerLoadAg() {
  return (
    <Widget
      widget={HeatmapChart({
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
          background: "#0f172a",
          title: { text: "Server CPU", visible: true },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const t = Math.min(value / 95, 1);
            const bg = value >= 85
              ? `rgba(239,68,68,${0.7 + t * 0.3})`
              : value >= 60
                ? `rgba(251,191,36,${0.4 + t * 0.4})`
                : `rgba(56,189,248,${0.1 + t * 0.5})`;
            return Container({
              decoration: new BoxDecoration({ color: bg }),
              child: Center({
                child: Text(`${value}%`, {
                  style: new TextStyle({
                    fontSize: 8,
                    color: value >= 60 ? "#ffffff" : "rgba(255,255,255,0.6)",
                    fontWeight: value >= 85 ? "700" : "400",
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
