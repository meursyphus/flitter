import { BarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<BarChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
