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
  Opacity,
} from "flitter-ui";

export default function CustomerJourneyToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Aware", "Consider", "Decide", "Buy", "Retain"],
          yLabels: ["Organic", "Social", "Email", "Ads", "Referral"],
          values: [
            [85, 60, 40, 25, 50],
            [70, 55, 30, 18, 35],
            [30, 45, 65, 55, 70],
            [90, 50, 35, 20, 15],
            [40, 60, 55, 45, 65],
          ],
        },
        config: {
          heatmap: { colorRange: ["#e0f2fe", "#0ea5e9", "#0c4a6e"], segment: { gap: 2 } },
        },
        custom: {
          segment: ({ value, xIndex }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const funnelOpacity = 1.0 - xIndex * 0.15;
            const t = Math.min(value / 90, 1);
            const bg = `rgba(14,165,233,${t * 0.9 + 0.1})`;
            const isStrong = value >= 60;
            return Opacity({
              opacity: funnelOpacity,
              child: Container({
                decoration: new BoxDecoration({
                  color: bg,
                  borderRadius: BorderRadius.circular(4),
                }),
                child: Center({
                  child: Text(isStrong ? `${value}%` : `${value}`, {
                    style: new TextStyle({
                      fontSize: isStrong ? 11 : 9,
                      color: t > 0.5 ? "#ffffff" : "#0c4a6e",
                      fontWeight: isStrong ? "700" : "400",
                    }),
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
