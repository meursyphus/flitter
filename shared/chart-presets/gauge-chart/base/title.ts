import type { GaugeChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function Title(...args: Parameters<GaugeChartCustom["title"]>) {
  return Cartesian.Title();
}
