"use client";

import Widget from "@flitterjs/react";
import { HeatmapChart } from "shared/chart";

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
        config: {},
      })}
      width="100%"
      height="100%"
    />
  );
}
