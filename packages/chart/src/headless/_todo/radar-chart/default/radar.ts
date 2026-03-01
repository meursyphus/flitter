import type { RadarChartCustom } from "../types";
import { Stack, type Widget } from "flitter-core";

export function Radar(
  ...[{ grid, axes, datasets, axisLabels }]: Parameters<
    RadarChartCustom["radar"]
  >
): Widget {
  return Stack({
    children: [grid, axes, datasets, axisLabels],
  });
}
