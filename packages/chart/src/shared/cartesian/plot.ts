import type { CartesianCustom } from "./types";
import { Align, Alignment, DockLayout, Stack, type Widget } from "flitter-core";

export function Plot({
  dataView,
  xAxis,
  yAxis,
  grid,
  axisCorner,
}: Parameters<CartesianCustom["plot"]>[0]): Widget {
  return DockLayout({
    left: yAxis,
    bottom: xAxis,
    corner: Align({
      alignment: Alignment.topRight,
      child: axisCorner,
    }),
    fill: Stack({ children: [grid, dataView] }),
  });
}
