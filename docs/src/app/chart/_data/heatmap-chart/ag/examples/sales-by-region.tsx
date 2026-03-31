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
  Column,
  MainAxisSize,
  SizedBox,
  EdgeInsets,
} from "flitter-ui";

export default function SalesByRegionAg() {
  return (
    <Widget
      widget={HeatmapChart({
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
          heatmap: { colorRange: ["#fef3c7", "#f59e0b", "#92400e"], segment: { gap: 2 } },
        },
        custom: {
          segment: ({ value }: { value: number; xIndex: number; yIndex: number }, _context: any) => {
            const max = 510;
            const t = Math.min(value / max, 1);
            const r = Math.round(254 + (146 - 254) * t);
            const g = Math.round(243 + (64 - 243) * t);
            const b = Math.round(199 + (14 - 199) * t);
            const isTop = value >= 400;
            return Container({
              margin: EdgeInsets.all(1),
              decoration: new BoxDecoration({
                color: `rgb(${r},${g},${b})`,
                borderRadius: BorderRadius.circular(6),
              }),
              child: Center({
                child: Column({
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(isTop ? "$" + value : `${value}`, {
                      style: new TextStyle({
                        fontSize: isTop ? 11 : 9,
                        color: t > 0.5 ? "#ffffff" : "#78350f",
                        fontWeight: isTop ? "700" : "400",
                      }),
                    }),
                    ...(isTop
                      ? [
                          SizedBox({ height: 1 }),
                          Text("TOP", {
                            style: new TextStyle({
                              fontSize: 6,
                              color: "#fef3c7",
                              fontWeight: "700",
                            }),
                          }),
                        ]
                      : []),
                  ],
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
