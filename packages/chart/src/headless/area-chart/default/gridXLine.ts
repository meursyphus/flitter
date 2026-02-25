import { AreaChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<AreaChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
