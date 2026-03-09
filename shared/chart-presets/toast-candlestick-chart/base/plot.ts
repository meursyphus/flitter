import type { CandlestickChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function Plot(...args: Parameters<CandlestickChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
