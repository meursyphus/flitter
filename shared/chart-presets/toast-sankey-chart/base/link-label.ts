import type { SankeyChartCustom } from "../types";
import { SizedBox } from "flitterjs";

export function LinkLabel(
  ..._args: Parameters<SankeyChartCustom["linkLabel"]>
) {
  return SizedBox.shrink();
}
