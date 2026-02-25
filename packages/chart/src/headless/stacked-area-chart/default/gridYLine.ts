import { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(
  ..._: Parameters<StackedAreaChartCustom["gridYLine"]>
) {
  return Cartesian.GridYLine();
}
