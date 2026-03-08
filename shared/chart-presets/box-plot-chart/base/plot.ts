import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "../../_flitter/shared/cartesian/index";

export function Plot(...args: Parameters<BoxPlotChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
