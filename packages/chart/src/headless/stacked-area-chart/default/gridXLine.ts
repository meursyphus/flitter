import { StackedAreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(
  ..._: Parameters<StackedAreaChartCustom["gridXLine"]>
) {
  return Cartesian.GridXLine();
}
