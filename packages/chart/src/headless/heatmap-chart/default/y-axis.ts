import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function YAxis(...args: Parameters<HeatmapCustom["yAxis"]>) {
  return Cartesian.YAxis(args[0], {
    type: "label",
  });
}
