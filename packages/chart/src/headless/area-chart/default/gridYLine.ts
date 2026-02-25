import { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<AreaChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
