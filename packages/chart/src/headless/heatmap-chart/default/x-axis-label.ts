import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function XAxisLabel(...args: Parameters<HeatmapCustom["xAxisLabel"]>) {
  return Cartesian.XAxisLabel(args[0]);
}
