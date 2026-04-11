import type { CartesianCustom } from "./types";
import { Align, Alignment, Stack, type Widget } from "flitter-core";
import { DockFrame } from "./dock-frame";

export function Plot({
  dataView,
  xAxis,
  yAxis,
  grid,
  axisCorner,
  tooltipArea,
}: Parameters<CartesianCustom["plot"]>[0]): Widget {
  return DockFrame({
    left: yAxis,
    bottom: xAxis,
    leftCorner: Align({
      alignment: Alignment.topRight,
      child: axisCorner,
    }),
    fill: Stack({ clipped: false, children: [grid, dataView, tooltipArea] }),
  });
}
