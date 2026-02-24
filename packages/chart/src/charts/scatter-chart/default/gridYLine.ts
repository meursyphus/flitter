import { ScatterChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<ScatterChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
