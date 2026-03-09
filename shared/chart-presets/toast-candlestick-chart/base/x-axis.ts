import type { CandlestickChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function XAxis(...args: Parameters<CandlestickChartCustom["xAxis"]>) {
  return Cartesian.XAxis(args[0], { type: "label" });
}
