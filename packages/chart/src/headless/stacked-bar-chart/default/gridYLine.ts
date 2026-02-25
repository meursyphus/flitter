import { StackedBarChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<StackedBarChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
