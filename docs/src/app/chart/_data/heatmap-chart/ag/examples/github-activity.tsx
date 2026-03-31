"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";
import { Text, TextStyle } from "flitter-ui";

export default function GithubActivityAg() {
  return (
    <Widget
      widget={HeatmapChart({
        data: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [
            [3, 0, 5, 2, 8, 1, 0, 4, 6, 9, 2, 1],
            [0, 7, 3, 0, 2, 5, 1, 0, 8, 3, 0, 4],
            [5, 2, 0, 6, 1, 0, 9, 3, 2, 0, 7, 2],
            [1, 0, 4, 3, 0, 8, 2, 7, 0, 5, 1, 0],
            [0, 3, 1, 0, 5, 2, 0, 1, 4, 0, 3, 6],
            [2, 1, 0, 0, 1, 0, 3, 0, 1, 2, 0, 0],
            [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0],
          ],
        },
        config: {
          heatmap: { colorRange: ["#ebedf0", "#9be9a8", "#216e39"], segment: { gap: 2 } },
        },
        custom: {
          xAxisLabel: ({ name, index }: { name: string; index: number }, context: any) => {
            const { font } = context.config;
            const short = name.substring(0, 1);
            const isQ = index % 3 === 0;
            return Text(isQ ? name : short, {
              style: new TextStyle({
                fontFamily: font.family,
                fontSize: isQ ? font.size : font.size - 1,
                fontWeight: isQ ? "700" : "normal",
                color: isQ ? "#216e39" : "#9ca3af",
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
