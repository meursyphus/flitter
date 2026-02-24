import type { HeatmapData, HeatmapScale } from "../types";

export function getScale({
  values,
}: Omit<HeatmapData, "xLabels" | "yLabels">): HeatmapScale {
  return {
    min: Math.min(...values.flat()),
    max: Math.max(...values.flat()),
  }
}
