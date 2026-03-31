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

export default function WebsiteClicksToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Head", "Hero", "Feat", "Price", "Review", "Foot"],
          yLabels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"],
          values: [
            [5, 12, 8, 3, 2, 4],
            [22, 45, 35, 28, 15, 10],
            [30, 55, 48, 42, 20, 12],
            [25, 50, 40, 38, 18, 11],
            [18, 38, 30, 22, 12, 8],
            [10, 25, 18, 15, 8, 6],
            [3, 8, 5, 2, 1, 2],
          ],
        },
        config: {
          heatmap: { colorRange: ["#f5f3ff", "#8b5cf6", "#4c1d95"], segment: { gap: 1 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const isHot = value >= 40;
            const t = Math.min(value / 55, 1);
            const bg = `rgba(139,92,246,${0.1 + t * 0.9})`;
            return Container({
              decoration: new BoxDecoration({
                color: bg,
                border: isHot
                  ? Border.all({ color: "#facc15", width: 2 })
                  : undefined,
              }),
              child: Center({
                child: isHot
                  ? Text(`${value}`, {
                      style: new TextStyle({
                        fontSize: 10,
                        color: "#facc15",
                        fontWeight: "800",
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
