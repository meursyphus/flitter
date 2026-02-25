import { BubbleChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridXLine(..._: Parameters<BubbleChartCustom["gridXLine"]>) {
  return Cartesian.GridXLine();
}
