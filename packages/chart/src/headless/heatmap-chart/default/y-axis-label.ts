import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxisLabel(...args: Parameters<HeatmapCustom["yAxisLabel"]>) {
  return Cartesian.YAxisLabel(args[0]);
}
