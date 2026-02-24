import type { SankeyChartCustom } from "../types";
import { Text } from "flitter-core";

export function Title(
  ...[{ name }]: Parameters<SankeyChartCustom["title"]>
) {
  return Text(name);
}
