import type { SankeyChartCustom } from "../types";
import { Text, type Widget } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<SankeyChartCustom["title"]>
): Widget {
  return Text(name);
}
