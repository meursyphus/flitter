import { SizedBox } from "flitter-core";
import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...[{ xAxis, yAxis, heatmap }]: Parameters<HeatmapCustom["plot"]>) {
  return Cartesian.Plot({
    xAxis,
    yAxis,
    series: heatmap,
    grid: SizedBox.shrink(),
  });
}
