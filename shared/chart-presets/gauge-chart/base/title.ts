import type { GaugeChartCustom } from "../types";
import * as Cartesian from "../../_flitter/shared/cartesian/index";

export function Title(...args: Parameters<GaugeChartCustom["title"]>) {
  return Cartesian.Title();
}
