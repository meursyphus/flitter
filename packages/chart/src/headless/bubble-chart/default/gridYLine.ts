import { BubbleChartCustom} from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function GridYLine(..._: Parameters<BubbleChartCustom["gridYLine"]>) {
  return Cartesian.GridYLine();
}
