import type { CandlestickChartCustom } from "../types";
import { Align, Alignment, Stack } from "flitter-core";
import { DockFrame } from "@shared/cartesian/index";

export function Plot(...args: Parameters<CandlestickChartCustom["plot"]>) {
  const [{ dataView, xAxis, yAxis, grid, axisCorner, tooltipArea }] = args;

  return DockFrame({
    right: yAxis,
    bottom: xAxis,
    rightCorner: Align({
      alignment: Alignment.topLeft,
      child: axisCorner,
    }),
    fill: Stack({
      clipped: false,
      children: [grid, dataView, tooltipArea],
    }),
  });
}
