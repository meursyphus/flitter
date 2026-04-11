import type { SankeyChartCustom } from "../types";
import { SizedBox } from "flitter-core";

export function LinkLabel(
  ..._args: Parameters<SankeyChartCustom["linkLabel"]>
) {
  return SizedBox.shrink();
}
