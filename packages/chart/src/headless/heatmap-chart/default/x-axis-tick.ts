import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisTick(...args: Parameters<HeatmapCustom["xAxisTick"]>) {
  return Cartesian.XAxisTick(args[0]);
}
