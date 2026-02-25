import type { CartesianCustom } from "./types";
import { DockLayout, Stack, type Widget } from "flitter-core";

export function Plot({
  series,
  xAxis,
  yAxis,
  grid,
  axisCorner,
}: Parameters<CartesianCustom["plot"]>[0]): Widget {
  return DockLayout({
    left: yAxis,
    bottom: xAxis,
    corner: axisCorner,
    fill: Stack({ children: [grid, series] }),
  });
}
