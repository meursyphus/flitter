"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";
import { Text, TextStyle, Column, MainAxisSize, CrossAxisAlignment, SizedBox, Container, BoxDecoration, BorderRadius, EdgeInsets } from "flitter-ui";

export default function BasicHeatmapAg() {
  return (
    <Widget
      widget={HeatmapChart({
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
          heatmap: { colorRange: ["#eff6ff", "#60a5fa", "#1e40af"] },
        },
        custom: {
          title: (_args: undefined, context: any) => {
            const { font, title } = context.config;
            return Container({
              padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 6 }),
              decoration: new BoxDecoration({
                color: "#eff6ff",
                borderRadius: BorderRadius.circular(6),
              }),
              child: Column({
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text("Weekly Temperature", {
                    style: new TextStyle({
                      fontFamily: title?.fontFamily ?? font.family,
                      fontSize: 14,
                      fontWeight: "700",
                      color: "#1e40af",
                    }),
                  }),
                  SizedBox({ height: 2 }),
                  Text("Avg. daily highs in Celsius", {
                    style: new TextStyle({
                      fontFamily: font.family,
                      fontSize: 10,
                      color: "#3b82f6",
                    }),
                  }),
                ],
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
