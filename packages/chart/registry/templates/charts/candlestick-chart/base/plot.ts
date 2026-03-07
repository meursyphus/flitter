import type { CandlestickChartCustom } from "../types";
import * as Cartesian from "@shared/cartesian/index";

export function Plot(...args: Parameters<CandlestickChartCustom["plot"]>) {
  return Cartesian.Plot(args[0]);
}
