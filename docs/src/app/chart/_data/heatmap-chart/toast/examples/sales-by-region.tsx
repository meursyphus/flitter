"use client";

import Widget from "@flitterjs/react";
import { ToastHeatmapChart } from "shared/chart";
import { Text, TextStyle, Row, SizedBox, MainAxisSize } from "flitter-ui";

const regionFlags: Record<string, string> = {
  NA: "\ud83c\uddfa\ud83c\uddf8",
  EU: "\ud83c\uddea\ud83c\uddfa",
  APAC: "\ud83c\uddef\ud83c\uddf5",
  LATAM: "\ud83c\udde7\ud83c\uddf7",
  ME: "\ud83c\udde6\ud83c\uddea",
};

export default function SalesByRegionToast() {
  return (
    <Widget
      widget={ToastHeatmapChart({
        data: {
          xLabels: ["Elec", "Cloth", "Food", "Furn", "Sports", "Books"],
          yLabels: ["NA", "EU", "APAC", "LATAM", "ME"],
          values: [
            [420, 280, 350, 180, 220, 150],
            [380, 310, 290, 160, 190, 200],
            [510, 260, 400, 120, 170, 130],
            [180, 220, 310, 90, 140, 80],
            [150, 170, 250, 110, 200, 60],
          ],
        },
        config: {
          heatmap: { colorRange: ["#fef3c7", "#f59e0b", "#92400e"] },
        },
        custom: {
          yAxisLabel: ({ name }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const flag = regionFlags[name] ?? "";
            return Row({
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(flag, {
                  style: new TextStyle({ fontSize: 13 }),
                }),
                SizedBox({ width: 4 }),
                Text(name, {
                  style: new TextStyle({
                    fontFamily: font.family,
                    fontSize: font.size,
                    fontWeight: "600",
                    color: "#78350f",
                  }),
                }),
              ],
            });
          },
        },
      })}
      width="100%"
      height="100%"
    />
  );
}
