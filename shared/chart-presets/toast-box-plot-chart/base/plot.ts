import type { BoxPlotChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function Plot(...args: Parameters<BoxPlotChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
