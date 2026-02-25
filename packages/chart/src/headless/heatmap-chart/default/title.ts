import type { HeatmapCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Title(...args: Parameters<HeatmapCustom["title"]>) {
  return Cartesian.Title(args[0]);
}
