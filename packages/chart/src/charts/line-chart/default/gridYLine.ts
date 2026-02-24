import { LineChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<LineChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
