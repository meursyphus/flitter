import type { CandlestickChartCustom } from "../types";
import * as Cartesian from "flitter-ui/chart";

export function YAxis(
  ...[{ line, labels, tick }, ctx]: Parameters<CandlestickChartCustom["yAxis"]>
) {
  return Cartesian.YAxis(
    { line, labels, tick },
    {
      type: "value",
      gap: ctx.config?.axis?.label?.gap,
      side: "right",
    },
  );
}
