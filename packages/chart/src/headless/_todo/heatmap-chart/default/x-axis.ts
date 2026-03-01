import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxis(...args: Parameters<HeatmapCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], {
    type: "label",
  });
}
