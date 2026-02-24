import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisTick(...args: Parameters<HeatmapCustom["yAxisTick"]>) {
  return Cartesian.YAxisTick(args[0]);
}
